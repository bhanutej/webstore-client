import { useState, useEffect, useCallback } from 'react';
import { Col, Row, Spin, Upload, notification } from 'antd';
import axios from 'axios';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

import { FormInput } from '../../FormInputs/Input/Input';
import { FormTextArea } from '../../FormInputs/TextArea/Input';
import { FormSelect } from '../../FormInputs/Select/Select';
import { TagSelect } from '../../FormInputs/Select/TagSelect';
import { ADD_PRODUCT, UPDATE_PRODUCT, PUBLISH } from '../../../GraphQL/Mutations';
import { LOAD_CATEGORIES } from '../../../GraphQL/Queries';

import './ProductForm.css';
import { WelcomeContent } from '../../WelcomeContent';

export const NewProductForm = () => {
  const featureObj = {
    name: "",
    label: "",
    attachment: null
  }
  const [categories, setCategories] = useState([]);
  const [productForm, setProductForm] = useState({features: [featureObj], keyWords: []});
  const [isAttachmentsUploaded, setIsAttachmentsUploaded] = useState(false)
  const [addProduct] = useMutation(ADD_PRODUCT);
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const [publishProduct] = useMutation(PUBLISH);
  const {loading, data, error} = useQuery(LOAD_CATEGORIES);
  const navigate = useNavigate();

  console.log(error);

  const handleInput = (event, field) => {
    setProductForm({...productForm, [field]: event.target.value});
  }
  
  const handleSelectInput = (value, field) => {
    setProductForm({...productForm, [field]: value});
  }

  const handleFeatureInput = (event, index) => {
    const existedFeatures = productForm.features;
    existedFeatures[index]['name'] = event.target.value;
    setProductForm({...productForm, features: [...existedFeatures]});
  }
  
  const handleFeatureLabelInput = (event, index) => {
    const existedFeatures = productForm.features;
    existedFeatures[index]['label'] = event.target.value;
    setProductForm({...productForm, features: [...existedFeatures]});
  }

  const addNewFeatureToList = () => {
    const existedFeatures = productForm.features;
    setProductForm({...productForm, features: [...existedFeatures, featureObj]});
  }

  const removeFeatureList = (index) => {
    const existedFeatures = productForm.features;
    existedFeatures.splice(index, 1);
    setProductForm({...productForm, features: existedFeatures});
  }

  const [fileList, setFileList] = useState([]);

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  
  const featureAttachmentChange = ({ file: file }, index) => {
    const existedFeatures = productForm.features;
    existedFeatures[index]['attachment'] = file;
    setProductForm({...productForm, features: [...existedFeatures]});
  };
  
  const removeFeatureAttachment = ({ file: file }, index) => {
    const existedFeatures = productForm.features;
    const prodFeature = existedFeatures[index];
    prodFeature['attachment'] = null;
    existedFeatures.splice(index, 1);
    setProductForm({...productForm, features: [...existedFeatures, prodFeature]});
  };

  const onPreview = async (file) => {
    let src = file.url;

    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);

        reader.onload = () => resolve(reader.result);
      });
    }

    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };


  const clearOldImages = useCallback(async () => {
    if (productForm.features && productForm.features.length > 0) {
      for(let i = 0; i < productForm.features.length; i++) {
        await axios({
          method: "put",
          url: "http://localhost:3300/product/remove_attachment",
          data: {
            oldPath: productForm.features[i].path
          },
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
    }
  }, [productForm.features]);

  const publishApplication = async () => {
    publishProduct({
      variables: {
        productId: productForm.id
      }
    })
    .then(res => {
      openNotificationWithIcon('success', 'Success', res.data.publish.message);
    })
    .catch(errors => {
      const code = errors.networkError.result.errors[0].extensions.code;
      const message = errors.networkError.result.errors[0].message;
      openNotificationWithIcon('error', code, message);
    })
    .finally((errors) => {
      console.log("errors>>", errors);
    })
  }

  
  const saveApplication = async () => {
    clearOldImages();
    const attachmentFeatures = productForm.features;
    const updateAttachments = new Promise(async (resolve, reject) => {
      if (productForm.features && productForm.features.length > 0) {
        const prodFeatures = [];
        for(let i = 0; i < productForm.features.length; i++) {
          const formData = new FormData();
          const productFeature = productForm.features[i];
          formData.append("attachment", productFeature['attachment'].originFileObj);
          try {
            const attachmentResponse = await axios({
              method: "put",
              url: "http://localhost:3300/product/attachment",
              data: formData,
              headers: { "Content-Type": "multipart/form-data" },
            });
            const { fileResponse } = attachmentResponse.data;
            productFeature['attachment'] = attachmentFeatures[i]['attachment'];
            productFeature['url'] = fileResponse.url;
            productFeature['path'] = fileResponse.path;
            prodFeatures.push(productFeature);
          } catch (error) {
          }
        }
        if (productForm.features.length > 0) {
          resolve(prodFeatures);
        }
      } else {
        reject('Please fill the required fields')
      }
    });
    updateAttachments
      .then((appFeatureAttachments) => {
        setProductForm({...productForm, features: [...appFeatureAttachments]});
        setIsAttachmentsUploaded(true);
      })
      .catch((error) => {
        openNotificationWithIcon('error', "Form Details", error);
      })
  }

  const openNotificationWithIcon = (type, code, message) => {
    notification[type]({
      message: code,
      description: message,
    });
  };

  const handleTagSelectInput = (tags) => {
    setProductForm({...productForm, keyWords: tags});
  }

  useEffect(() => {
    if (data && data.categories) {
      setCategories(data.categories);
    }
  }, [data]);

  useEffect(() => {
    if (isAttachmentsUploaded) {
      if (productForm.id) {
        const updateProductForm = productForm;
        delete updateProductForm['status'];
        delete updateProductForm['publishedAt'];
        delete updateProductForm['__typename'];
        updateProduct({
          variables: {
            input: updateProductForm
          }
        })
        .then(res => {
          const formFeatures = productForm.features;
          const formResp = res.data.updateProduct;
          const newProddata = Object.assign({}, formResp, { features: formFeatures });
          setProductForm({...newProddata});
          openNotificationWithIcon('success', 'Success', 'Application updated successfully!');
        })
        .catch(errors => {
          clearOldImages();
          const code = errors.networkError.result.errors[0].extensions.code;
          const message = errors.networkError.result.errors[0].message;
          openNotificationWithIcon('error', code, message);
        })
        .finally(() => {
          setIsAttachmentsUploaded(false);
        })
      } else {
        addProduct({
          variables: {
            input: productForm
          }
        })
        .then(res => {
          const formFeatures = productForm.features;
          const formResp = res.data.addProduct;
          const newProddata = Object.assign({}, formResp, { features: formFeatures });
          setProductForm({...newProddata});
          openNotificationWithIcon('success', 'Success', 'Application created successfully!');
        })
        .catch(errors => {
          clearOldImages();
          const code = errors.networkError.result.errors[0].extensions.code;
          const message = errors.networkError.result.errors[0].message;
          openNotificationWithIcon('error', code, message);
        })
        .finally(() => {
          setIsAttachmentsUploaded(false);
        })
      }
    }
  }, [isAttachmentsUploaded]);

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  return <>
    {loading && <Spin />}
    
    <Row>
      <Col span={3}></Col>
      <Col span={18}>
        <div className="webstore-home-container">
          <WelcomeContent />
        </div>
        <div className='add-product-form-container'>
          <p className='form-title'>List your Application</p>
          <Row gutter={12}>
            <Col span={12}>
              <FormInput 
                label="Company Name"
                onChange={(event) => handleInput(event, 'companyName')}
                value={productForm['companyName']}
                required={true}
              />
            </Col>
            <Col span={12}>
              <FormInput 
                label="Contact Person"
                onChange={(event) => handleInput(event, 'contactPerson')}
                value={productForm['contactPerson']}
                required={true}
              />
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <FormInput 
                label="Email"
                onChange={(event) => handleInput(event, 'email')}
                value={productForm['email']}
                required={true}
              />            
            </Col>
            <Col span={12}>
              <FormInput 
                label="contact"
                onChange={(event) => handleInput(event, 'contact')}
                value={productForm['contact']}
                required={true}
              />
            </Col>          
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <FormInput 
                label="Application Name"
                onChange={(event) => handleInput(event, 'name')}
                value={productForm['name']}
                required={true}
              />
            </Col>
            <Col span={12}>              
              <TagSelect
                label="Application keywords"
                mode="tags"
                size="large"
                placeholder="Please select"
                style={{
                  width: '100%',
                }}
                onChange={(tags) => handleTagSelectInput(tags)}
                options={productForm['keyWords']}
              />
              </Col>
          </Row>
          <Row gutter={12}>
            <Col span={24}>
              <FormInput 
                label="Product / Comapny URL"
                onChange={(event) => handleInput(event, 'companyUrl')}
                value={productForm['companyUrl']}
                required={true}
              />
            </Col>
          </Row>
          <Row gutter={12}>            
            <Col span={24}>
              <FormTextArea 
                label="Application / Software Description"
                onChange={(event) => handleInput(event, 'description')}
                value={productForm['description']}
              />
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={24}>              
              <FormSelect 
                label="Category"
                onChange={(value) => handleSelectInput(value, 'categoryId')}
                value={productForm['categoryId']}
                options={categories}
              />
            </Col>
          </Row>
          <div className='feature-list-label-container'>
            <p className='feature-list-label-title'>List your features here</p>            
            <p className='feature-list-label-sub-title'>(Max user can add 6 features for more please UPDRAGE)</p>
          </div>
          {productForm.features && productForm.features.map((feature, index) => {
            const attachmentArray = feature.attachment ? [feature.attachment] : []
            return <Row gutter={12} className='features-row-container' key={`feature_${index}`}>
              <Col span={6}>
                <FormInput 
                  label={`Feature label ${index+1}`}
                  onChange={(event) => handleFeatureLabelInput(event, index)}
                  value={feature.label}
                  required={true}
                />
              </Col>
              <Col span={10}>
                <FormTextArea 
                  label={`Feature ${index+1}`}
                  onChange={(event) => handleFeatureInput(event, index)}
                  value={feature.name}
                  required={true}
                />
              </Col>
              <Col span={6}>
                <Upload
                  customRequest={dummyRequest}
                  listType="picture-card"
                  fileList={attachmentArray}
                  onChange={(event) => featureAttachmentChange(event, index)}
                  onPreview={onPreview}
                  onRemove={(event) => removeFeatureAttachment(event, index)}
                >
                  {fileList.length <= 0 && '+ Upload'}
                </Upload>
              </Col>
              <Col span={2}>
                <div className="remove-btn-container">
                  <button className='btn-chip' onClick={() => removeFeatureList(index)}>Remove</button>
                </div>
              </Col>
            </Row>
          })}
          {productForm.features && productForm.features.length < 6 ? <div className='add-more-feature-lable' onClick={addNewFeatureToList}>+ Add More</div> : <></>}
          <div className="action-container">
            <button className='btn-primary' onClick={saveApplication}>Save as Draft</button>
            {productForm.id ? <button className='btn-primary' onClick={publishApplication}>Publish</button> : <></>}
            <button className='btn-plain' onClick={() => navigate('/', { replace: true })}>Cancel</button>
          </div>
        </div>
      </Col>
      <Col span={3}></Col>
    </Row>
  </>
}
