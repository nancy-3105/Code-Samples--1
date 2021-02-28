import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import theme from '@ow/ow-components/lib/theme.js';
import Icon from '@ow/ow-components/lib/components/Icon';
import lodashGet from 'lodash.get';
import Button from '@ow/ow-components/lib/components/Button';
import Spinner from '../../components/Spinner';
import SchoolListSummaryPanel from '../../components/SchoolListSummaryPanel';
import { SKU } from '../../constants/slProduct';
import ProductImage from '../../components/ProductImage';
import { isError, isLoading, isSuccessful } from '../../utils/slHelper';

const Wrapper = styled.div`
  margin: ${theme.space.none} 15px;
  @media ${theme.mediaSize.mediumMin} {
    margin: ${theme.space.none} 60px;
  }
`;
const Column = styled.div`
  font: ${theme.fontSizes.standard} Arial;
  cursor: pointer;
`;
const SchoolListImage = styled.div`
  margin-right: ${theme.space.half};
  display: flex;
  svg {
    width: 40px;
    height: 26px;
  }

  @media ${theme.mediaSize.mediumMin} {
    svg {
      width: 39px;
      height: 45px;
    }
  }
`;
const SchoolListInfoTopPanel = styled.div`
  width: 100%;
  display: block;

  @media ${theme.mediaSize.mediumMin} {
    width: 100%;
    display: flex;
  }
`;
const Select = styled.div`
  ${props => (props.isSelect ? `color:#CCCCCC; cursor:not-allowed` : `color:#005BAB`)};
`;
const Deselect = styled.div`
  ${props => (!props.isSelect ? `color:#CCCCCC;  cursor:not-allowed` : `color:#005BAB`)};
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${theme.space.standard};
  padding: ${theme.space.none} ${theme.space.standard};
`;

const ViewDetailsWrapper = styled.div`
  font-size: ${theme.fontSizes.standard};
  margin-top: ${theme.space.half};
  span {
    cursor: pointer;
  }

  @media ${theme.mediaSize.mediumMin} {
    margin-top: ${theme.space.none};
  }
`;

const Heading = styled.h1`
  text-align: center;
  font-size: 24px;
  margin-top: ${theme.space.standard};
  margin-bottom: ${theme.space.standard};

  @media ${theme.mediaSize.mediumMin} {
    font-size: 32px;
    margin-bottom: ${theme.space.double};
  }
  @media ${theme.mediaSize.largeMin} {
    font-size: 36px;
    margin-top: ${theme.space.double};
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  margin: ${theme.space.double};
  font-size: 34px;
  font-weight: bold;
  font-family: ${theme.fonts.brand};
`;

const SchoolListsWrapper = styled.div`
  margin-top: 30px;
  width: 100%;
`;

const SchoolLists = styled.div`
  margin-top: 15px;
`;

const SelectAll = styled.div`
  margin: 15px 10px 12px 2px;
  ${Row} ${Column} {
    width: 26%;
  }

  ${Row} {
    justify-content: flex-start;
  }

  @media ${theme.mediaSize.mediumMin} {
    width: 62%;
    ${Row} ${Column} {
      width: 21%;
    }
  }

  @media ${theme.mediaSize.largeMin} {
    width: 78%;
    margin: ${theme.space.none} ${theme.space.half} ${theme.space.none} ${theme.space.none};
    ${Row} ${Column} {
      width: 10%;
    }
  }
`;

const SelectWrapper = styled.div`
  height: 20px;
  margin-right: 2%;

  input {
    width: 20px;
    height: 20px;
  }
`;

const SchoolListInfoPanel = styled.div`
  display: flex;
`;
const CustomerDeliveryMessage = styled.div`
  background: #d9edf7;
  color: #31708f;
  padding: 10px;
  display: flex;
  svg {
    width: 45px;
    height: 20px;
    fill: #31708fs;
  }

  @media ${theme.mediaSize.mediumMin} {
    svg {
      width: 24px;
      height: 20px;
    }
  }
`;

const SchoolListWrapper = styled.div`
  display: block;
  justify-content: space-between;
  background: white;

  padding: ${theme.space.standard};
  margin-bottom: ${theme.space.half};

  color: ${theme.colors.primary};

  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.standard};

  @media ${theme.mediaSize.mediumMin} {
    font-size: 18px;
    svg {
      height: 45px;
    }
  }
`;

const SchoolListDescriptionWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 80%;
  @media ${theme.mediaSize.mediumMin} {
    width: 90%;
    display: flex;
    font-size: 18px;
    align-items: flex-start;
  }
`;

const ReadyForReviewWrapper = styled.div`
  display: flex;
  span {
    font-size: ${theme.fontSizes.sm};
    color: #999999;
    height: auto;
    width: 114px;
    height: 24px;
    background: #ffffff;
    border: 1px solid #999999;
    border-radius: ${theme.fontSizes.standard};
    margin-top: ${theme.space.half};
    padding: 3px 10px 4px 7px;
  }
  @media ${theme.mediaSize.mediumMin} {
    span {
      width: 126px;
      height: 24px;
      padding: 2px 15px;
      margin-top: ${theme.space.none};
    }
  }
`;

const StyledSchoolListsWrapper = styled(SchoolListsWrapper)`
  @media ${theme.mediaSize.smallMax} {
    margin-bottom: ${theme.space.double};
  }
`;

const SchoolListInfo = styled.div`
  width: 100%;
`;

const SchoolListTitle = styled.div`
  font-size: ${theme.fontSizes.standard};
  font-weight: bold;
  @media ${theme.mediaSize.mediumMin} {
    width: 53%;
    font-size: 18px;
    line-height: 16px;
    color: #005bab;
    height: auto;
  }
`;

const ReviewedSchoolListTitle = styled(SchoolListTitle)`
  word-break: break-word;
  padding-right: 10px;
  @media ${theme.mediaSize.mediumMin} {
    width: 47%;
  }
  @media ${theme.mediaSize.largeMin} {
    width: 50%;
  }
`;

const ReviewedWrapper = styled(ReadyForReviewWrapper)`
  width: 50%;
  span {
    color: #5abcee;
    border: 1px solid #5abcee;
    width: 85px;
  }
`;

const AddedToCartWrapper = styled(ReadyForReviewWrapper)`
  span {
    color: ${theme.colors.addToCart};
    margin: ${theme.space.none} ${theme.space.half};
    border: 1px solid ${theme.colors.addToCart};
    width: 107px;
  }
`;

const ReviewListButton = styled(Button)`
  min-width: 127px;
  height: 36px;
  margin-left: ${theme.space.standard};
  padding-top: ${theme.space.quarter};
  @media ${theme.mediaSize.mediumMin} {
    min-width: 120px;
  }
`;

const EditListButton = styled(Button)`
  min-width: 100px;
  margin-left: ${theme.space.half};
  height: 36px;
  padding-top: ${theme.space.quarter};
`;

const AddToCartWrapper = styled.div`
  width: 100%;
  display: block;
  margin-top: ${theme.space.standard};
  border: none;

  @media ${theme.mediaSize.mediumMin} {
    display: flex;
  }

  @media ${theme.mediaSize.largeMin} {
    margin-top: ${theme.space.half};
  }
`;

const AddToCartButton = styled.button`
  display: flex;
  justify-content: center;
  padding: ${theme.space.half} ${theme.space.standard};
  margin-bottom: ${theme.space.half};
  font-size: ${theme.fontSizes.md};
  font-weight: bold;
  line-height: ${theme.lineHeights.button};
  border-radius: ${theme.radii.standard};
  border: 1px solid ${theme.colors.addToCart};
  color: white;
  background: ${theme.colors.addToCart};
  border-color: ${theme.colors.addToCart};
  cursor: pointer;
  width: 100%;

  @media ${theme.mediaSize.mediumMin} {
    width: auto;
  }

  :hover {
    border-color: ${theme.colors.addToCartHover};
    background: ${theme.colors.addToCartHover};
  }

  :disabled {
    cursor: not-allowed;
    background: ${theme.colors.disabled};
    border-color: ${theme.colors.disabled};
    opacity: 0.65;
  }
`;

const ProductImageWrapper = styled.div`
  flex-shrink: 0;
  margin-right: ${theme.space.half};

  img,
  svg {
    width: 100%;
  }

  width: 40px;
  @media ${theme.mediaSize.mediumMin} {
    width: 40px;
    height: 40px;
  }

  @media ${theme.mediaSize.xLargeMin} {
    width: 40px;
    height: 40px;
  }
`;

class Review extends React.Component {
  state = {
    isChecked: {},
    selectAll: true,
    isToggled: {}
  };

  componentDidMount() {
    const submissionId = lodashGet(this.props, ['match', 'params', 'submissionId']);

    if (!this.props.slProduct) {
      this.props.getSLProduct();
    }
    this.props.getAllSchoolLists({ submissionId });
    this.props.getCart();
    this.setState({
      isChecked: {
        ...this.state.isChecked,
        ...Object.keys(this.props.schoolListsStatus || {}).reduce(
          (acc, curr) => ({ ...acc, [curr]: true }),
          {}
        )
      }
    });
  }

  toggleShowMore = referenceNumber => {
    this.setState({
      isToggled: {
        ...this.state.isToggled,
        [referenceNumber]: !this.state.isToggled[referenceNumber]
      }
    });
  };

  checkeBoxUpdate = referenceNumber => {
    this.setState({
      isChecked: {
        ...this.state.isChecked,
        [referenceNumber]: !this.state.isChecked[referenceNumber]
      }
    });
    const isAllSchoolListsSelected = Object.values(this.state.isChecked).every(key => key === true);
    isAllSchoolListsSelected
      ? this.setState({ selectAll: true })
      : this.setState({ selectAll: false });
  };

  selectDeselectAll = option => {
    const { isChecked } = this.state;
    let checkedData = {};
    if (option === 'select') {
      this.setState({ selectAll: true });
      Object.entries(isChecked).forEach(([key]) => {
        checkedData = {
          ...checkedData,
          [key]: true
        };
      });
      this.setState({
        isChecked: checkedData
      });
    } else {
      this.setState({ selectAll: false });
      Object.entries(isChecked).forEach(([key]) => {
        checkedData = {
          ...checkedData,
          [key]: false
        };
      });
      this.setState({
        isChecked: checkedData
      });
    }
  };
  hasError = () => {
    return (
      this.props.schoolListError &&
      Object.values(this.props.schoolListError).some(error => Boolean(error))
    );
  };

  handleAddToCart = () => {
    const { addSchoolListsToCart, schoolListsReviewed } = this.props;
    const { isChecked } = this.state;

    const selectedSchoolListsReviewed = schoolListsReviewed.filter(
      list => isChecked[lodashGet(list, 'referenceNumber')]
    );
    addSchoolListsToCart(selectedSchoolListsReviewed);
  };

  componentDidUpdate(prevProps) {
    const { allSchoolLists, history } = this.props;
    if (
      prevProps.allSchoolLists &&
      prevProps.allSchoolLists.length !== 1 &&
      allSchoolLists &&
      allSchoolLists.length === 1
    ) {
      const referenceNumber = allSchoolLists[0].referenceNumber;
      history.push(`/app/school-list-edit/${referenceNumber}`);
    }

    const { addSchoolListsToCartStatus, showNotification } = this.props;
    const prevBackendCallStatuses = [prevProps.addSchoolListsToCartStatus];
    const backendCallStatuses = [addSchoolListsToCartStatus];
    const error = isError(backendCallStatuses);
    const successful = isSuccessful(backendCallStatuses);

    const prevError = isError(prevBackendCallStatuses);
    const prevSuccessful = isSuccessful(prevBackendCallStatuses);

    if (!prevSuccessful && successful) {
      const submissionId = lodashGet(this.props, ['match', 'params', 'submissionId']);
      this.setState({ addToCartLoading: false });
      history.push(`/app/school-list-edit/add-to-cart-success?submissionId=${submissionId}`);
    }

    if (!prevError && error) {
      showNotification({ text: 'Failed adding products to cart', type: 'failure' });
    }
  }

  render() {
    const {
      schoolListFetchStatus,
      cartFetchStatus,
      slProductFetchStatus,
      cartAddStatus,
      addSchoolListsToCartStatus
    } = this.props;
    const backendCallStatuses = [
      schoolListFetchStatus,
      cartFetchStatus,
      slProductFetchStatus,
      addSchoolListsToCartStatus
    ];
    const loading = isLoading(backendCallStatuses);
    const error = isError(backendCallStatuses);

    const addToCartLoading = isLoading([cartAddStatus]);

    if (loading) {
      return <Spinner data-ref="spinner" />;
    }

    if (error) {
      const errorMessage =
        this.props.schoolListErrorStatus === 404
          ? 'School lists not found'
          : 'Failed to load school lists';

      return <ErrorMessage data-ref="error-message">{errorMessage}</ErrorMessage>;
    }
    const { isChecked, selectAll } = this.state;
    const {
      allSchoolLists,
      history,
      schoolListsReadyForReview,
      schoolListsReviewed,
      schoolListsAddedToCart,
      addedToCartReferenceNumber
    } = this.props;
    if (!allSchoolLists) return null;

    let isCheckedReviewed = {};
    Object.entries(isChecked).forEach(([key, value]) => {
      if (!addedToCartReferenceNumber.includes(key)) {
        isCheckedReviewed[key] = value;
      }
    });
    const disableButton = !Object.values(isCheckedReviewed).includes(true);

    const { totalPrice, originalTotalPrice } = this.props;
    const checker = Array.isArray(originalTotalPrice);

    const editPagePath = (item, isAddedToCart = false) =>
      isAddedToCart
        ? `/app/school-list-edit/${item.referenceNumber}?submissionId=${
            item.submissionId
          }&edit=true`
        : `/app/school-list-edit/${item.referenceNumber}?submissionId=${item.submissionId}`;

    return (
      <Wrapper data-ref="school-lists">
        <Heading>Your school lists</Heading>
        <CustomerDeliveryMessage>
          <Icon name="components--alert--bell" color="#005bab" />
          <span>
            Please note that on placing multiple lists in your order, your lists will be packed
            together
          </span>
        </CustomerDeliveryMessage>
        {schoolListsReadyForReview.length > 0 && (
          <StyledSchoolListsWrapper>
            <div data-ref="school-lists-ready-for-review">
              You have{' '}
              <strong>
                {schoolListsReadyForReview.length} school{' '}
                {schoolListsReadyForReview.length === 1 ? 'list' : 'lists'}
              </strong>{' '}
              pending reivew
            </div>
            <SchoolLists>
              {schoolListsReadyForReview.map(item => {
                const originalPrice =
                  checker === true
                    ? parseInt(
                        originalTotalPrice.find(i => i.referenceNumber === item.referenceNumber)
                          .price
                      )
                    : parseInt(originalTotalPrice);
                const officeworksPrice =
                  checker === true
                    ? parseInt(
                        totalPrice.find(i => i.referenceNumber === item.referenceNumber).price
                      )
                    : parseInt(totalPrice);
                const isToggled = Boolean(this.state.isToggled[item.referenceNumber]);
                return (
                  <SchoolListWrapper key={item.referenceNumber}>
                    <SchoolListInfoPanel>
                      <SchoolListDescriptionWrapper>
                        <ProductImageWrapper>
                          <ProductImage sku={SKU} size={80} isParentSL={true} />
                        </ProductImageWrapper>
                        <SchoolListInfo>
                          <SchoolListInfoTopPanel>
                            <SchoolListTitle>{`${item.studentName}'s school list`}</SchoolListTitle>
                            <ReadyForReviewWrapper>
                              <span data-ref="ready-for-review-status">Ready for review</span>
                            </ReadyForReviewWrapper>
                          </SchoolListInfoTopPanel>

                          <ViewDetailsWrapper data-ref={`view-detail-${item.referenceNumber}`}>
                            <span
                              data-ref="view-detail-button"
                              onClick={() => this.toggleShowMore(item.referenceNumber)}
                            >
                              {' '}
                              {isToggled ? 'Hide details' : 'View details'}
                            </span>
                          </ViewDetailsWrapper>
                        </SchoolListInfo>
                      </SchoolListDescriptionWrapper>
                      <ReviewListButton
                        data-ref="review-list-button"
                        primary
                        onClick={() => history.push(editPagePath(item))}
                      >
                        Review list
                      </ReviewListButton>
                    </SchoolListInfoPanel>
                    <SchoolListSummaryPanel
                      data-ref="school-list-summary-panel"
                      item={item}
                      originalPrice={originalPrice}
                      officeworksPrice={officeworksPrice}
                      isToggled={isToggled}
                    />
                  </SchoolListWrapper>
                );
              })}
            </SchoolLists>
          </StyledSchoolListsWrapper>
        )}
        {schoolListsReviewed.length > 0 && (
          <SchoolListsWrapper data-ref="reviewed-school-lists">
            <div data-ref="school-lists-reviewed">
              You have{' '}
              <strong>
                {schoolListsReviewed.length} school{' '}
                {schoolListsReviewed.length === 1 ? 'list' : 'lists'}
              </strong>{' '}
              ready to add to cart
            </div>
            <SchoolLists>
              {schoolListsReviewed.map(item => {
                const originalPrice =
                  checker === true
                    ? parseInt(
                        originalTotalPrice.find(i => i.referenceNumber === item.referenceNumber)
                          .price
                      )
                    : parseInt(originalTotalPrice);
                const officeworksPrice =
                  checker === true
                    ? parseInt(
                        totalPrice.find(i => i.referenceNumber === item.referenceNumber).price
                      )
                    : parseInt(totalPrice);
                const isToggled = Boolean(this.state.isToggled[item.referenceNumber]);
                const filtered = Object.keys(isChecked).some(
                  key => (key === item.referenceNumber && isChecked[key] ? true : false)
                );
                return (
                  <SchoolListWrapper key={item.referenceNumber}>
                    <SchoolListInfoPanel>
                      <SchoolListDescriptionWrapper>
                        <SchoolListImage>
                          <SelectWrapper>
                            <input
                              type="checkbox"
                              data-ref={`toggle-reviewed-list-button-${item.referenceNumber}`}
                              checked={filtered}
                              onChange={() => this.checkeBoxUpdate(item.referenceNumber)}
                            />
                          </SelectWrapper>
                          <ProductImageWrapper>
                            <ProductImage sku={SKU} size={80} isParentSL={true} />
                          </ProductImageWrapper>
                        </SchoolListImage>
                        <SchoolListInfo>
                          <SchoolListInfoTopPanel>
                            <ReviewedSchoolListTitle>{`${
                              item.studentName
                            }'s school list`}</ReviewedSchoolListTitle>
                            <ReviewedWrapper data-ref="reviewed-status">
                              <span>Reviewed</span>
                            </ReviewedWrapper>
                          </SchoolListInfoTopPanel>
                          <ViewDetailsWrapper data-ref={`view-detail-${item.referenceNumber}`}>
                            <span
                              data-ref="view-detail-button"
                              onClick={() => this.toggleShowMore(item.referenceNumber)}
                            >
                              {' '}
                              {isToggled ? 'Hide details' : 'View details'}
                            </span>
                          </ViewDetailsWrapper>
                        </SchoolListInfo>
                      </SchoolListDescriptionWrapper>
                      <EditListButton
                        data-ref="edit-list-button"
                        onClick={() => history.push(editPagePath(item))}
                      >
                        Edit list
                      </EditListButton>
                    </SchoolListInfoPanel>
                    <SchoolListSummaryPanel
                      item={item}
                      originalPrice={originalPrice}
                      officeworksPrice={officeworksPrice}
                      isToggled={isToggled}
                    />
                  </SchoolListWrapper>
                );
              })}
            </SchoolLists>

            <AddToCartWrapper>
              <SelectAll>
                <Row>
                  <Column>
                    <Select
                      data-ref={`select-all-reviewed-list-button`}
                      onClick={() => this.selectDeselectAll('select')}
                      isSelect={selectAll}
                    >
                      Select all
                    </Select>
                  </Column>
                  <Column>
                    <Deselect
                      data-ref={`deselect-all-reviewed-list-button`}
                      onClick={() => this.selectDeselectAll('deselect')}
                      isSelect={selectAll}
                    >
                      Deselect all
                    </Deselect>
                  </Column>
                </Row>
              </SelectAll>
              <AddToCartButton
                data-ref="proceed-and-add-to-cart"
                disabled={addToCartLoading || this.hasError() || disableButton}
                onClick={this.handleAddToCart}
              >
                Proceed and add to cart
              </AddToCartButton>
            </AddToCartWrapper>
          </SchoolListsWrapper>
        )}
        {schoolListsAddedToCart.length > 0 && (
          <StyledSchoolListsWrapper>
            <div data-ref="school-lists-added-to-cart">
              You have{' '}
              <strong>
                {schoolListsAddedToCart.length} school{' '}
                {schoolListsAddedToCart.length === 1 ? 'list' : 'lists'}
              </strong>{' '}
              added to cart
            </div>
            <SchoolLists>
              {schoolListsAddedToCart.map(item => {
                const originalPrice =
                  checker === true
                    ? parseInt(
                        originalTotalPrice.find(i => i.referenceNumber === item.referenceNumber)
                          .price
                      )
                    : parseInt(originalTotalPrice);
                const officeworksPrice =
                  checker === true
                    ? parseInt(
                        totalPrice.find(i => i.referenceNumber === item.referenceNumber).price
                      )
                    : parseInt(totalPrice);
                const isToggled = Boolean(this.state.isToggled[item.referenceNumber]);
                return (
                  <SchoolListWrapper key={item.referenceNumber}>
                    <SchoolListInfoPanel>
                      <SchoolListDescriptionWrapper>
                        <ProductImageWrapper>
                          <ProductImage sku={SKU} size={80} isParentSL={true} />
                        </ProductImageWrapper>
                        <SchoolListInfo>
                          <SchoolListInfoTopPanel>
                            <ReviewedSchoolListTitle>{`${
                              item.studentName
                            }'s school list`}</ReviewedSchoolListTitle>
                            <AddedToCartWrapper data-ref="added-to-cart-status">
                              <span>Added to cart</span>
                            </AddedToCartWrapper>
                          </SchoolListInfoTopPanel>
                          <ViewDetailsWrapper data-ref={`view-detail-${item.referenceNumber}`}>
                            <span
                              data-ref="view-detail-button"
                              onClick={() => this.toggleShowMore(item.referenceNumber)}
                            >
                              {' '}
                              {isToggled ? 'Hide details' : 'View details'}
                            </span>
                          </ViewDetailsWrapper>
                        </SchoolListInfo>
                      </SchoolListDescriptionWrapper>
                      <EditListButton
                        data-ref="edit-list-button"
                        onClick={() => history.push(editPagePath(item, true))}
                      >
                        Edit list
                      </EditListButton>
                    </SchoolListInfoPanel>
                    <SchoolListSummaryPanel
                      item={item}
                      originalPrice={originalPrice}
                      officeworksPrice={officeworksPrice}
                      isToggled={isToggled}
                    />
                  </SchoolListWrapper>
                );
              })}
            </SchoolLists>
          </StyledSchoolListsWrapper>
        )}
      </Wrapper>
    );
  }

  static propTypes = {
    slProduct: PropTypes.object,
    getSLProduct: PropTypes.func.isRequired,
    addSchoolListsToCart: PropTypes.func.isRequired,
    getAllSchoolLists: PropTypes.func.isRequired,
    schoolListFetchStatus: PropTypes.string.isRequired,
    cartFetchStatus: PropTypes.string.isRequired,
    addSchoolListsToCartStatus: PropTypes.string.isRequired,
    cartAddStatus: PropTypes.string.isRequired,
    slProductFetchStatus: PropTypes.string.isRequired,
    allSchoolLists: PropTypes.arrayOf(
      PropTypes.shape({
        referenceNumber: PropTypes.string.isRequired,
        studentName: PropTypes.string.isRequired,
        firstName: PropTypes.string,
        submissionId: PropTypes.string.isRequired,
        items: PropTypes.object.isRequired
      })
    ).isRequired,
    history: PropTypes.object.isRequired,
    schoolListError: PropTypes.object.isRequired,
    showNotification: PropTypes.func.isRequired,
    getCart: PropTypes.func.isRequired,
    cart: PropTypes.shape({
      items: PropTypes.array
    }).isRequired,
    addedToCartReferenceNumber: PropTypes.array,
    schoolListsReadyForReview: PropTypes.array,
    schoolListsReviewed: PropTypes.array,
    schoolListsStatus: PropTypes.object.isRequired,
    schoolListErrorStatus: PropTypes.number,
    schoolListsAddedToCart: PropTypes.array,
    totalPrice: PropTypes.array.isRequired,
    originalTotalPrice: PropTypes.array.isRequired
  };
}

export default Review;
