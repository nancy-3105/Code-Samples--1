import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import theme from '@ow/ow-components/lib/theme';
import { DoubleTick, ExclamationTriangle, Remove } from '../../components/icons';
import { priceToString } from '@ow/ow-components/lib/Utils';
import ProductImage from '../../components/ProductImage';
import lodashGet from 'lodash.get';
import lodashDebounce from 'lodash.debounce';
import { getLowestPrice } from '../../selectors/schoolListSelector';
import AlternativeProduct from '../AlternativeProduct';
import { NOT_ENOUGH_STOCK, OUT_OF_STOCK } from '../../constants/delivery';
import ReplacedProductContent from '../ReplacedProductContent/ReplacedProductContent';
import { isStockSubstituted } from '../../utils/schoolListUtils';

const Products = styled.div`
  padding: 0 ${theme.space.standard} 0;
  margin-bottom: ${theme.space.standard};
`;

export const ProductDescription = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;

  @media (min-width: 800px) {
    flex-direction: row;
    align-items: center;
  }
`;

const ProductHeading = styled.div`
  padding: ${theme.space.half};
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  svg {
    display: block;
    margin-right: ${theme.space.half};
  }
`;

const ProductHeadingContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProductHeadingInfo = styled.div``;

export const ProductContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: ${theme.space.standard};
  padding-right: ${theme.space.half};
  overflow: hidden;

  @media (min-width: 800px) {
    align-items: center;
  }
`;

export const ProductImageWrapper = styled.div`
  flex-shrink: 0;
  margin-right: ${theme.space.standard};
  width: 40px;
  img {
    display: block;
  }
`;

export const ProductName = styled.div`
  flex-shrink: 0;
  font-weight: bold;
  color: ${theme.colors.primary};
  margin-right: ${theme.space.double};

  margin-bottom: ${theme.space.half};
  @media (min-width: 800px) {
    width: 230px;
    margin-bottom: 0;
  }
`;

export const ProductQuantity = styled.div`
  flex-shrink: 0;
  font-weight: bold;

  margin-bottom: ${theme.space.half};
  @media (min-width: 800px) {
    margin-bottom: 0;
  }
`;

export const ProductPrice = styled.div`
  flex-grow: 1;
  font-size: ${theme.fontSizes.lg};
  line-height: 27px;
  font-weight: bold;
  color: ${theme.colors.primary};

  margin-right: ${theme.space.standard};

  @media (min-width: 800px) {
    text-align: right;
  }
`;

const Controls = styled.div`
  flex-shrink: 0;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  padding: ${theme.space.half};
  cursor: pointer;

  svg {
    display: block;
    fill: ${theme.colors.textDisclaimer};
  }
`;

const Product = styled.div`
  border-width: 2px;
  border-style: solid;
  border-radius: ${theme.radii.panel};
  overflow: hidden;
  margin-bottom: ${theme.space.half};

  ${({ success }) =>
    success
      ? css`
          border-color: ${theme.colors.success};

          ${ProductHeading} {
            background: #dff0d8;
            color: #3c763d;

            svg {
              fill: #3c763d;
            }
            button {
              color: #3c763d;
            }
          }

          ${ToggleContainer} {
            max-height: 0;
          }
        `
      : css`
          border-color: ${theme.colors.alert};

          ${ProductHeading} {
            background: #f2dede;
            color: ${theme.colors.alert2};
            svg {
              fill: ${theme.colors.alert2};
            }
            button {
              color: ${theme.colors.alert2};
            }
          }
        `};
`;

const ToggleContainer = styled.div`
  overflow-y: auto;
  transition: max-height 0.2s ease-out;
  max-height: 200px;
`;

const ReduceQuantityButton = styled.button`
  border: none;
  background: none;
  padding: ${theme.space.quarter} 0;
  font-size: ${theme.fontSizes.sm};
  text-decoration: underline;

  cursor: pointer;
  :hover {
    text-decoration: none;
  }
`;

const DefaultMessage = styled.div`
  font-size: ${theme.fontSizes.lg};
  margin-bottom: ${theme.space.standard};
`;

const SchoolListEmptyWrapper = styled.div`
  margin-top: ${theme.space.standard};
  margin-bottom: ${theme.space.double};
`;

const Link = styled.a`
  :hover {
    text-decoration: underline;
  }
`;

class StockCheckProducts extends Component {
  saveSchoolListDebounced = lodashDebounce(this.props.saveSchoolList, 500);

  getLowestTotalPrice = item => {
    const ofwItem = lodashGet(item, 'ofw', {});
    const lowestUnitPrice = this.getLowestUnitPrice(ofwItem);

    return lowestUnitPrice * ofwItem.qty;
  };

  getLowestUnitPrice = (ofwItem = {}) => {
    const { prices } = this.props;
    return getLowestPrice({ ofwItem, prices });
  };

  handleRemove = ({ index }) => {
    this.props.removeOutOfStock({ index });
    this.saveSchoolListDebounced();
  };

  handleReduceQuantity = ({ index, quantity }) => {
    this.props.updateQuantity({ index, quantity });
    this.saveSchoolListDebounced();
  };

  handleAddToCartAgain = () => {
    const {
      schoolList: { referenceNumber },
      history
    } = this.props;
    history.push(`/app/school-list-edit/${referenceNumber}`);
  };

  getDelivery(sku, qty) {
    const { deliveries = [] } = this.props;
    return (
      deliveries.find(
        e =>
          (e.requestedQuantity === qty ||
            (e.availableQuantity === qty && e.requestedQuantity > qty)) &&
          e.sku === sku
      ) || {}
    );
  }

  isItemSuccessfullySubstituted(item) {
    const { sku, qty } = lodashGet(item, 'ofw', {});
    const { deliveries = [] } = this.props;
    const delivery = deliveries.find(
      e => e && e.sku === sku && e.requestedQuantity === qty && e.availableQuantity >= qty
    );

    return isStockSubstituted(item) && delivery !== undefined;
  }

  getSkuBySubstitute(item) {
    const ofwItem = lodashGet(item, 'ofw', {});
    if (item && this.isItemSuccessfullySubstituted(item) && ofwItem.initialSku) {
      return ofwItem.initialSku;
    }
    return ofwItem.sku;
  }

  render() {
    const { products, schoolList, isSchoolListEmpty, prices } = this.props;
    const items = lodashGet(schoolList, 'items', []);

    const hasStockIssues = items.some(item => {
      const { sku, qty } = lodashGet(item, 'ofw', {});
      const delivery = this.getDelivery(sku, qty);
      const deliveryStatus = lodashGet(delivery, 'status');

      return [OUT_OF_STOCK, NOT_ENOUGH_STOCK].includes(deliveryStatus);
    });

    return (
      <Products data-ref="stock-check-products">
        {items.map((item, index) => {
          const { sku, qty } = lodashGet(item, 'ofw', {});
          const skuConsideringSubstitute = this.getSkuBySubstitute(item);
          const delivery = this.getDelivery(skuConsideringSubstitute, qty);
          const { requestedQuantity, status, availableQuantity } = delivery;
          const productName = lodashGet(products, [sku, 'name']);
          const isRemoved = item.removed;
          const isSubstituted = this.isItemSuccessfullySubstituted(item);
          const isOutOfStock = status === OUT_OF_STOCK;
          const isNotEnoughStock = status === NOT_ENOUGH_STOCK;
          const isQuantityValid = qty === availableQuantity;

          if (isOutOfStock) {
            return (
              <Product
                data-ref="out-of-stock-product"
                data-ref-sku={sku}
                success={isRemoved || isSubstituted}
                key={sku + index}
              >
                <ProductHeading>
                  {isRemoved || isSubstituted ? (
                    <DoubleTick width={16} height={16} />
                  ) : (
                    <ExclamationTriangle width={16} height={16} />
                  )}
                  <ProductHeadingContent>
                    {isRemoved ? (
                      <ProductHeadingInfo data-ref="product-heading-removed">
                        <strong>Item removed</strong>
                      </ProductHeadingInfo>
                    ) : isSubstituted ? (
                      <ProductHeadingInfo data-ref="product-heading-replaced">
                        <strong>Item replaced</strong>
                      </ProductHeadingInfo>
                    ) : (
                      <ProductHeadingInfo data-ref="product-heading-out-of-stock">
                        <strong>Items in this school list are out of stock!</strong> Please remove
                        item to continue
                      </ProductHeadingInfo>
                    )}
                  </ProductHeadingContent>
                </ProductHeading>
                <ToggleContainer>
                  <ProductContent>
                    <ProductImageWrapper>
                      <ProductImage sku={sku} size={40} />
                    </ProductImageWrapper>
                    <ProductDescription>
                      <ProductName>{productName}</ProductName>
                      <ProductQuantity>Quantity: {requestedQuantity}</ProductQuantity>
                      <ProductPrice>
                        {priceToString(this.getLowestTotalPrice(item), true)}
                      </ProductPrice>
                    </ProductDescription>
                    <Controls>
                      <RemoveButton
                        data-ref="remove-item-button"
                        onClick={() => this.handleRemove({ index })}
                        aria-label={`Remove product ${sku} from cart`}
                      >
                        <Remove width={20} height={20} />
                      </RemoveButton>
                    </Controls>
                  </ProductContent>
                  <AlternativeProduct
                    delivery={delivery}
                    product={lodashGet(products, [sku])}
                    index={index}
                  />
                </ToggleContainer>
                <ReplacedProductContent
                  sku={sku}
                  name={productName}
                  delivery={delivery}
                  isSubstituted={isSubstituted}
                  prices={prices}
                />
              </Product>
            );
          } else if (isNotEnoughStock) {
            return (
              <Product
                data-ref="not-enough-stock-product"
                data-ref-sku={sku}
                success={isQuantityValid || isRemoved || isSubstituted}
                key={sku}
              >
                <ProductHeading>
                  {isQuantityValid || isRemoved || isSubstituted ? (
                    <DoubleTick width={16} height={16} />
                  ) : (
                    <ExclamationTriangle width={16} height={16} />
                  )}
                  <ProductHeadingContent>
                    {isQuantityValid ? (
                      <ProductHeadingInfo data-ref="product-heading-quantity-reduced">
                        <strong>Item quantity reduced</strong>
                      </ProductHeadingInfo>
                    ) : isRemoved ? (
                      <ProductHeadingInfo data-ref="product-heading-removed">
                        <strong>Item removed</strong>
                      </ProductHeadingInfo>
                    ) : isSubstituted ? (
                      <ProductHeadingInfo data-ref="product-heading-replaced">
                        <strong>Item replaced</strong>
                      </ProductHeadingInfo>
                    ) : (
                      <ProductHeadingInfo data-ref="product-heading-not-enough-stock">
                        <div>
                          <strong>
                            We only have {availableQuantity} units of this product in stock
                          </strong>
                        </div>
                        <ReduceQuantityButton
                          data-ref="reduce-quantity-button"
                          onClick={() =>
                            this.handleReduceQuantity({ index, quantity: availableQuantity })
                          }
                        >
                          Reduce quantity to {availableQuantity} items
                        </ReduceQuantityButton>
                      </ProductHeadingInfo>
                    )}
                  </ProductHeadingContent>
                </ProductHeading>
                <ToggleContainer>
                  <ProductContent>
                    <ProductImageWrapper>
                      <ProductImage sku={sku} size={40} />
                    </ProductImageWrapper>
                    <ProductDescription>
                      <ProductName>{productName}</ProductName>
                      <ProductQuantity>Quantity: {qty}</ProductQuantity>
                      <ProductPrice>
                        {priceToString(this.getLowestTotalPrice(item), true)}
                      </ProductPrice>
                    </ProductDescription>
                    <Controls>
                      <RemoveButton
                        data-ref="remove-item-button"
                        onClick={() => this.handleRemove({ index })}
                        aria-label={`Remove product ${sku} from cart`}
                      >
                        <Remove width={20} height={20} />
                      </RemoveButton>
                    </Controls>
                  </ProductContent>
                  <AlternativeProduct
                    delivery={delivery}
                    product={lodashGet(products, [sku])}
                    index={index}
                  />
                </ToggleContainer>
                <ReplacedProductContent
                  sku={sku}
                  name={productName}
                  delivery={delivery}
                  isSubstituted={isSubstituted}
                  prices={prices}
                />
              </Product>
            );
          }
        })}
        {!isSchoolListEmpty &&
          !hasStockIssues && (
            <DefaultMessage>All items in your school list are in stock</DefaultMessage>
          )}
        {isSchoolListEmpty && (
          <SchoolListEmptyWrapper data-ref="school-list-empty-message">
            <div>
              <strong>It seems that your school list is empty! </strong>
              Please note that it will be removed from your cart.
            </div>
            <div>
              <Link onClick={this.handleAddToCartAgain} data-ref="add-to-cart-again-link">
                Review list and add to cart again
              </Link>
            </div>
          </SchoolListEmptyWrapper>
        )}
      </Products>
    );
  }

  static propTypes = {
    saveSchoolList: PropTypes.func.isRequired,
    removeOutOfStock: PropTypes.func.isRequired,
    updateQuantity: PropTypes.func.isRequired,
    schoolList: PropTypes.obj.isRequired,
    deliveries: PropTypes.obj.isRequired,
    products: PropTypes.obj.isRequired,
    prices: PropTypes.obj.isRequired,
    history: PropTypes.object.isRequired,
    isSchoolListEmpty: PropTypes.bool
  };

  static defaultProps = {
    isSchoolListEmpty: false
  };
}

export default StockCheckProducts;
