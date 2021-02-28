import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { get as _get } from 'lodash';
import { Field, reduxForm, reset as resetForm } from 'redux-form';
import styled from 'styled-components';
import { Muted } from '../../../config/styles.config';
import RoutePaths from '../../constants/routePaths';
import dropDownField from '../../components/FormFields/DropDownField';
import inputField from '../../components/FormFields/InputField';
import schoolsListField from '../../components/FormFields/SchoolsListField';
import textAreaField from '../../components/FormFields/TextAreaField';
import {
  validateName,
  validateGrade,
  validate
} from '../../components/FormValidations/FieldValidations';
import FileUpload from '../FileUpload';
import { areFilesUploaded } from '../../selectors/progressSelector';
import FormErrorMessage from '../../components/FormErrorMessage';
import { clearFiles, addChild, removeChild, updateFiles } from '../../store/actions/actions';
import { isCompareOMeterMode } from '../../utils/queryParamUtil';
import { scrollToTop, scrollTo } from '../../helpers/scrollHelper';
import { sizeMedia } from '../../../config/media.config';

const REDUX_FORM_NAME = 'childForm'; // The name of this redux-form

const handleSubmitSuccess = (result, dispatch, props) => {
  const { history } = props;
  history.push(RoutePaths.DETAILS_PAGE);
};

/**
 * Synchonous redux-form validation function
 * @param values
 * @param props
 */

const WarpperCC = styled.div``;
const ChildrenContainer = styled.div``;
const FormWrapper = styled.div``;
const  UploadFormContainer= styled.div`
padding: 0 10px`;
const List = styled.div``;
const FileUploadError = styled.div``;
const FileUploadContainer = styled.div``;
const UploadFileContainer = styled.div``;
const Messages = styled.div``;
const ListContainer = styled.div`
    border: 'solid 1px #e0e0e0',
    borderRadius: '5px',
    padding: '10px',
    marginTop: '10px',
    marginBottom: '10px'
`;

const ContainerCC = styled.div`
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row'
`;

const H3 = styled.h3`
  @media ${sizeMedia.smallOnly} {
    font-size: 16px;
  }
`;
const SavedListHeading = styled.h4``;

/////////////////////////////////////////////////
// Redux-form class

/**
 * Redux-form class
 */

export class ChildForm extends React.Component {
  constructor(props) {
    super();
    const children = _get(props, 'children', []);
    const inEditingState = !children.length;
    this.state = {
      showChildForm: inEditingState,
      isEditing: inEditingState,
      editingChild: {},
      showErrors: false
    };
    this.clickSubmit = this.clickSubmit.bind(this);
    this.myRef = React.createRef();
  }

  componentDidMount() {
    const { children, handleHasChildren } = this.props;
    const showChildren = children.length > 0;
    handleHasChildren(showChildren);
  }

  /**
   * This is a hack to make the form-level error message appear only after the Submit button is clicked
   */
  clickSubmit() {
    const { history } = this.props;
    this.setState({ showChildForm: false, isEditing: false });
    history.push(RoutePaths.DETAILS_PAGE);
  }

  handleSaveChild() {
    const { addChild, clearFiles, resetForm, files, childForm, validate, removeChild } = this.props;
    const values = _get(childForm, 'values');
    const errors = validate(values, this.props);
    if (!errors._error) {
      if (this.state.isEditing) {
        removeChild(this.state.editingChild);
      }
      addChild({ values, files });
      resetForm('childForm');
      clearFiles();
      scrollToTop();
      this.setState({
        showChildForm: false,
        isEditing: false,
        editingChild: {},
        showErrors: false
      });
    } else {
      this.setState({ showErrors: true });
    }
  }

  handleAddAnotherChild() {
    this.setState({ showChildForm: true });
    scrollTo(0, this.myRef.current.offsetTop);
  }

  handleCancelChild() {
    const { clearFiles, resetForm } = this.props;
    resetForm('childForm');
    clearFiles();
    scrollToTop();
    this.setState({ showChildForm: false, isEditing: false, editingChild: {} });
  }

  handleEditChild(child) {
    const { updateFiles } = this.props;
    const { values, files } = child;
    Object.keys(values).forEach(key => {
      this.props.change(key, values[key]);
    });
    updateFiles(files);
    this.setState({ showChildForm: true, isEditing: true, editingChild: child });
  }

  handleRemoveChild(child) {
    const { removeChild, children } = this.props;
    const childrenArray = children || [];
    if (confirm("Are you sure you want to delete this child's list?")) {
      this.setState({
        showChildForm: childrenArray.length === 1,
        isEditing: false
      });
      removeChild(child);
    }
  }

  /* CC stands for Child Component */

  renderChildComponent(child) {
    return (
      <WarpperCC>
        <ContainerCC>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
              wordBreak: 'break-all'
            }}
          >
            <ul className="list-unstyled">
              <li>
                <h5>{_get(child.values, 'name')}</h5>
              </li>
              <li>
                <strong>School:</strong> {_get(child.values, 'school')}
                <br />
                <strong>Grade:</strong> {_get(child.values, 'schoolYear')}
              </li>
              {child.files.map((file, itemIndex) => (
                <li key={itemIndex}>
                  <Muted>{file.name.slice(file.name.indexOf('_') + 1)}</Muted>
                </li>
              ))}
            </ul>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <div style={{ margin: '0.5em' }}>
              <button
                className="btn btn-block btn-default btn-sm"
                date-ref="edit-child-details"
                style={{
                  display: 'flex',
                  alignItems: 'center'
                }}
                onClick={() => {
                  this.handleEditChild(child);
                }}
              >
                <svg
                  viewBox="0 0 26.94 40"
                  fill="none"
                  style={{
                    padding: '0.2em',
                    width: '1em',
                    height: '1em',
                    boxSizing: 'content-box',
                    fill: 'none',
                    stroke: '#005bab',
                    strokeWidth: '2px'
                  }}
                >
                  <path d="M30.83,0.71a5.29,5.29,0,0,0-5.2,0h0c-0.15.08-.29,0.18-0.43,0.28A6.16,6.16,0,0,0,16.8,3.2l0,0h0L9.56,15.75l0,0,0,0.06,0,0.06h0a1.38,1.38,0,0,0,2.39,1.38h0L19.07,4.83h0l0.13-.25a3.37,3.37,0,0,1,4.12-1.46L8,29.75C6.7,31.94,5.4,38,8.19,39.66s7.95-2.93,8.93-4.63L32.76,7.93A5.29,5.29,0,0,0,30.83.71ZM25.27,5.33A1,1,0,0,1,26.55,5l2.72,1.57a1,1,0,0,1,.35,1.25l-13,22.58a1,1,0,0,1-1.28.33h0l-2.67-1.54h0a1,1,0,0,1-.35-1.31v0h0ZM14.45,34.41a10,10,0,0,1-3.18,2.71A1.49,1.49,0,0,1,9,35.75a10.2,10.2,0,0,1,.8-4l0-.1a1,1,0,0,1,1.34-.39l3,1.72a1,1,0,0,1,.33,1.35Z" />
                </svg>
                Edit
              </button>
            </div>
            <div style={{ margin: '0.5em' }}>
              <button
                className="btn btn-block btn-default btn-sm"
                style={{
                  display: 'flex',
                  alignItems: 'center'
                }}
                onClick={e => {
                  e.preventDefault();
                  this.handleRemoveChild(child);
                }}
              >
                <svg
                  viewBox="0 0 1792 1792"
                  style={{
                    padding: '0.2em',
                    width: '1em',
                    height: '1em',
                    boxSizing: 'content-box'
                  }}
                >
                  <path d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z" />
                </svg>
                Remove
              </button>
            </div>
          </div>
        </ContainerCC>
      </WarpperCC>
    );
  }

  render() {
    const { error, handleSubmit, pristine, submitting, children } = this.props;
    const { showChildForm, showErrors, isEditing } = this.state;
    const showChildren = children.length > 0 && !isEditing;
    const showCancelButton = children.length > 0 && showChildForm;
    return (
      <div>
        {showChildren && (
          <ChildrenContainer>
            <SavedListHeading data-ref="saved-lists">Saved Lists</SavedListHeading>
            <ListContainer>
              {children.map((child, index) => (
                <List key={_get(child.values, 'name')}>
                  {index > 0 && <hr />}
                  {this.renderChildComponent(child)}
                </List>
              ))}
            </ListContainer>
            <div style={{ 'margin-bottom': '30px', overflow: 'auto' }}>
              <div className="col-xs-12 col-md-4 pull-right">
                <button
                  data-ref="continue-button"
                  type="submit"
                  className={'btn btn-block btn-primary'}
                  onClick={this.clickSubmit}
                  style={{ marginBottom: '5px' }}
                >
                  <span>Continue</span>
                </button>
              </div>
              <div className="col-xs-12 col-md-4 pull-right">
                <button
                  data-ref="add-another-child"
                  type="button"
                  className="btn btn-block btn-default"
                  onClick={e => {
                    e.preventDefault();
                    this.handleAddAnotherChild();
                  }}
                >
                  Add another student
                </button>
              </div>
            </div>
          </ChildrenContainer>
        )}
        <div
          style={{
            marginTop: '30%'
          }}
          ref={this.myRef}
        />
        {showChildForm && (
          <UploadFormContainer>
          <form
            style={{
              marginTop: '-30%'
            }}
            name={REDUX_FORM_NAME}
            onSubmit={handleSubmit(() => {})}
          >
            <FormWrapper>
              <H3>Student details</H3>
              <Muted italic small>
                * Marks mandatory fields
              </Muted>
              <Field
                component={inputField}
                data-ref="child-name"
                label="Name"
                maxLength={60}
                name="name"
                required
                validate={validateName}
              />
              <Field
                component={schoolsListField}
                label="School name"
                name="school"
                required
                placeholder="e.g. East Bentleigh Primary School"
              />
              <Field
                component={dropDownField}
                label="Grade / Year"
                maxLength={30}
                name="schoolYear"
                required
                validate={validateGrade}
              >
                <option disabled value="">
                  Select
                </option>
                <option>Pre-prep</option>
                <option>Pre-Primary</option>
                <option>Kindergarten</option>
                <option>Prep</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>4 Laptop</option>
                <option>5</option>
                <option>5 Laptop</option>
                <option>6</option>
                <option>6 Laptop</option>
                <option>7</option>
                <option>8</option>
                <option>9</option>
                <option>10</option>
                <option>11</option>
                <option>12</option>
                <option>Post-secondary</option>
              </Field>
            </FormWrapper>
            <UploadFileContainer>
              <H3>Upload school list</H3>
              <Messages>
                <span>
                  Mark or highlight the items you would like{' '}
                  {isCompareOMeterMode() ? 'us to compare ' : 'to order '} from your school list
                </span>
                <span>
                  Please ensure uploaded images or scans of your school list are not blurry
                </span>
              </Messages>

              <Muted italic>File types supported PDF and images (JPG, JPEG and PNG)</Muted>
              <FileUploadContainer style={{ padding: '2em 0' }}>
                <FileUpload />
                {!this.props.filesUploaded && (
                  <FileUploadError style={{ marginTop: '10px' }} className="error">
                    Please upload at least one file
                  </FileUploadError>
                )}
              </FileUploadContainer>
              <Field
                component={textAreaField}
                label="Send a message to our team about your school list requirements."
                maxLength={500}
                name="note"
                placeholder="e.g. left handed scissors"
              />
            </UploadFileContainer>
            {showErrors && error && <FormErrorMessage>{error}</FormErrorMessage>}
            <div>
              <div className="col-xs-12 col-md-4 pull-right">
                <button
                  type="button"
                  data-ref="save-button"
                  className="btn btn-block btn-primary"
                  style={{ marginBottom: '5px' }}
                  disabled={pristine || submitting}
                  onClick={e => {
                    e.preventDefault();
                    this.handleSaveChild();
                  }}
                >
                  Save list
                </button>
              </div>
              {showCancelButton && (
                <div className="col-xs-12 col-md-4 pull-right">
                  <button
                    className="btn btn-block btn-default"
                    onClick={e => {
                      e.preventDefault();
                      this.handleCancelChild();
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </form>
          </UploadFormContainer>
        )}
      </div>
    );
  }
}

// Validate PropTypes

ChildForm.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object),
  children: PropTypes.arrayOf(PropTypes.object),
  error: PropTypes.string,
  filesUploaded: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  clearFiles: PropTypes.func,
  resetForm: PropTypes.func,
  addChild: PropTypes.func,
  updateFiles: PropTypes.func,
  removeChild: PropTypes.func,
  handleHasChildren: PropTypes.func,
  change: PropTypes.func,
  history: PropTypes.any,
  childForm: PropTypes.any,
  validate: PropTypes.func
};

// React-Redux state mapping

function mapStateToProps(state) {
  return {
    initialValues: {
      colourNotImportant: 'yes'
    },
    filesUploaded: areFilesUploaded(state),
    files: state.files,
    childForm: state.form.childForm,
    children: state.children
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      clearFiles,
      resetForm,
      addChild,
      updateFiles,
      removeChild
    },
    dispatch
  );
}

// Decorate the form component
const DetailsFormRF = reduxForm({
  form: REDUX_FORM_NAME, // a unique identifier for this form
  destroyOnUnmount: false, // Do not destroy the form on unmount
  forceUnregisterOnUnmount: true, // Force unregistration of fields on unmount but not the form's state
  validate, // validation function
  onSubmitSuccess: handleSubmitSuccess
})(ChildForm);

// Return a React-Redux container

const DetailsFormRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailsFormRF);
export default withRouter(DetailsFormRedux);

//
// Export Form fields' PropTypes for validation
//

export const ChildPropTypes = {
  colourNotImportant: PropTypes.string,
  noPreference: PropTypes.string,
  name: PropTypes.string.isRequired,
  school: PropTypes.string.isRequired,
  schoolYear: PropTypes.string.isRequired
};
