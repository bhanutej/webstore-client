import { useState, useEffect, useCallback } from 'react';
import { Col, Row, Spin, Upload, notification } from 'antd';
import ImgCrop from 'antd-img-crop';
import axios from 'axios';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

import { FormInput } from '../../FormInputs/Input/Input';
import { FormTextArea } from '../../FormInputs/TextArea/Input';
import { FormSelect } from '../../FormInputs/Select/Select';
import { TagSelect } from '../../FormInputs/Select/TagSelect';
import { ADD_PRODUCT, UPDATE_PRODUCT } from '../../../GraphQL/Mutations';
import { LOAD_CATEGORIES } from '../../../GraphQL/Queries';

import './ProductForm.css';
import { WelcomeContent } from '../../WelcomeContent';

export const NewProductForm = () => {
  const [categories, setCategories] = useState([]);
  const [productForm, setProductForm] = useState({features: [""], keyWords: [], attachments: []});
  const [attachments, setAttachments] = useState([]);
  const [isAttachmentsUploaded, setIsAttachmentsUploaded] = useState(false)
  const [addProduct] = useMutation(ADD_PRODUCT);
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const {loading, data, error} = useQuery(LOAD_CATEGORIES);
  const navigate = useNavigate();

  const handleInput = (event, field) => {
    setProductForm({...productForm, [field]: event.target.value});
  }
  
  const handleSelectInput = (value, field) => {
    setProductForm({...productForm, [field]: value});
  }

  const handleFeatureInput = (event, index) => {
    const existedFeatures = productForm.features;
    existedFeatures[index] = event.target.value;
    setProductForm({...productForm, features: [...existedFeatures]});
  }

  const addNewFeatureToList = () => {
    const existedFeatures = productForm.features;
    setProductForm({...productForm, features: [...existedFeatures, ""]});
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

  const onRemove = async (file) => {
    console.log("<<<<", file);
  }

  const clearOldImages = useCallback(() => {
    if (attachments && attachments.length > 0) {
      attachments.forEach(async (attachment) => {
        await axios({
          method: "put",
          url: "http://localhost:3300/product/remove_attachment",
          data: {
            oldPath: attachment.path
          },
          headers: { "Content-Type": "multipart/form-data" },
        });
      })
    } 
    productForm.attachments.forEach(async (attachment) => {
      const path = `/public${attachment.split("public")[1]}`
      await axios({
        method: "put",
        url: "http://localhost:3300/product/remove_attachment",
        data: {
          oldPath: path
        },
        headers: { "Content-Type": "multipart/form-data" },
      });
    })
  }, [attachments, productForm.attachments]);

  
  const saveApplication = async () => {
    clearOldImages();
    const updateAttachments = new Promise(async (resolve, reject) => {
      const appAttachments = [];
      console.log("fileList>>>>", fileList);
      if (fileList && fileList.length > 0) {
        for(let i = 0; i < fileList.length; i++) {
          const formData = new FormData();
          formData.append("attachment", fileList[i].originFileObj);
          try {
            const attachmentResponse = await axios({
              method: "put",
              url: "http://localhost:3300/product/attachment",
              data: formData,
              headers: { "Content-Type": "multipart/form-data" },
            });
            const { fileResponse } = attachmentResponse.data;
            appAttachments.push(fileResponse);
          } catch (error) {
            console.log("File Attachment Error", error);
          }
        }
        setAttachments(appAttachments);
        if (appAttachments.length > 0) {
          resolve(appAttachments);
        }
      } else {
        reject('Please fill the required fields')
      }
    });
    updateAttachments
      .then((appAttachments) => {
        const attachmentUrls = appAttachments.map(att => att.url);
        setProductForm({...productForm, attachments: attachmentUrls});
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
    console.log("isAttachmentsUploaded>>>", isAttachmentsUploaded);
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
          setProductForm({...res.data.updateProduct});
          openNotificationWithIcon('success', 'Success', 'Application updated successfully!');
        })
        .catch(errors => {
          // try to delete the file paths
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
          setProductForm({...res.data.addProduct});
          openNotificationWithIcon('success', 'Success', 'Application created successfully!');
        })
        .catch(errors => {
          // try to delete the file paths
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
            return <Row gutter={12} className='features-row-container' key={`feature_${index}`}>
              <Col span={20}>
                <FormInput 
                  label={`Feature ${index+1}`}
                  onChange={(event) => handleFeatureInput(event, index)}
                  value={feature}
                  required={true}
                />
              </Col>
              <Col span={2}>
                <Upload
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  listType="picture-card"
                  fileList={fileList}
                  onChange={onChange}
                  onPreview={onPreview}
                  onRemove={onRemove}
                >
                  {fileList.length < 1 && '+ Upload'}
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
          <Row>
            <p className='attachment-label'>Attach Screenshots & Videos:</p>
            <Col span={24}>
              <ImgCrop rotate>
                <Upload
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  listType="picture-card"
                  fileList={fileList}
                  onChange={onChange}
                  onPreview={onPreview}
                  onRemove={onRemove}
                >
                  {fileList.length < 5 && '+ Upload'}
                </Upload>
              </ImgCrop>
            </Col>
          </Row>
          <div className="action-container">
            <button className='btn-primary' onClick={saveApplication}>Save as Draft</button>
            <button className='btn-primary'>Publish</button>
            <button className='btn-plain' onClick={() => navigate('/', { replace: true })}>Cancel</button>
          </div>
        </div>
      </Col>
      <Col span={3}></Col>
    </Row>
  </>
}
