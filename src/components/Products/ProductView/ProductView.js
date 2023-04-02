
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";

import { LOAD_CATEGORIES, LOAD_PRODUCT } from "../../../GraphQL/Queries";

import './ProductView.css';
import { Col, Row, Upload } from "antd";
import { WelcomeContent } from "../../WelcomeContent";
import { FormInput } from "../../FormInputs/Input/Input";
import { FormTextArea } from "../../FormInputs/TextArea/Input";
import { TagSelect } from "../../FormInputs/Select/TagSelect";
import { FormSelect } from "../../FormInputs/Select/Select";

export const ProductView = () => {
  const featureObj = {
    name: "",
    label: "",
    attachment: null
  }
  const { PRODUCT_ID } = useParams();
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({features: [featureObj], keyWords: []});
  const [productId, setProductId] = useState(null);
  const [fileList, setFileList] = useState([]);

  const navigate = useNavigate();

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const loadedCategories = useQuery(LOAD_CATEGORIES);
  const {loading, data, error} = useQuery(LOAD_PRODUCT, {
    variables: { productId }
  });

  console.log("loadedCategories", loadedCategories);

  useEffect(() => {
    if (loadedCategories.data && loadedCategories.data.categories) {
      setCategories(loadedCategories.data.categories);
    }
  }, [loadedCategories.data]);

  useEffect(() => {
    if (PRODUCT_ID) {
      setProductId(Number(PRODUCT_ID));
    }
  }, [PRODUCT_ID]);

  useEffect(() => {
    if (data && data.product) {
      setProduct(data.product);
      const features = data.product.features.map(({ name, label, attachmentUrl, attachmentPath }) => ({
        label: label,
        name: name,
        attachmentUrl
      }));
      setProduct({...data.product, features: [...features]});
    }
  }, [data, productId]);

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

  const featureAttachmentChange = ({ file: file }, index) => {
    const existedFeatures = product.features;
    existedFeatures[index]['attachment'] = file;
    setProduct({...product, features: [...existedFeatures]});
  };

  const removeFeatureAttachment = ({ file: file }, index) => {
    const existedFeatures = product && product.features;
    const prodFeature = existedFeatures[index];
    prodFeature['attachment'] = null;
    existedFeatures.splice(index, 1);
    setProduct({...product, features: [...existedFeatures, prodFeature]});
  };

  const removeFeatureList = (index) => {
    const existedFeatures = product && product.features;
    existedFeatures.splice(index, 1);
    setProduct({...product, features: existedFeatures});
  }

  const addNewFeatureToList = () => {
    const existedFeatures = product && product.features;
    setProduct({...product, features: [...existedFeatures, featureObj]});
  }
  
  return (
    <>
      <h1>View: {productId}======{product && product && product.name}</h1>
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
                  // onChange={(event) => handleInput(event, 'companyName')}
                  value={product && product['companyName']}
                  required={true}
                />
              </Col>
              <Col span={12}>
                <FormInput 
                  label="Contact Person"
                  // onChange={(event) => handleInput(event, 'contactPerson')}
                  value={product && product['contactPerson']}
                  required={true}
                />
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <FormInput 
                  label="Email"
                  // onChange={(event) => handleInput(event, 'email')}
                  value={product && product['email']}
                  required={true}
                />            
              </Col>
              <Col span={12}>
                <FormInput 
                  label="contact"
                  // onChange={(event) => handleInput(event, 'contact')}
                  value={product && product['contact']}
                  required={true}
                />
              </Col>          
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <FormInput 
                  label="Application Name"
                  // onChange={(event) => handleInput(event, 'name')}
                  value={product && product['name']}
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
                  // onChange={(tags) => handleTagSelectInput(tags)}
                  options={product && product['keyWords'] && product['keyWords'].map((x) => x.name)}
                  value={product && product['keyWords'] && product['keyWords'].map((x) => x.name)}
                />
                </Col>
            </Row>
            <Row gutter={12}>
              <Col span={24}>
                <FormInput 
                  label="Product / Comapny URL"
                  // onChange={(event) => handleInput(event, 'companyUrl')}
                  value={product && product['companyUrl']}
                  required={true}
                />
              </Col>
            </Row>
            <Row gutter={12}>            
              <Col span={24}>
                <FormTextArea 
                  label="Application / Software Description"
                  // onChange={(event) => handleInput(event, 'description')}
                  value={product && product['description']}
                />
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={24}>              
                <FormSelect 
                  label="Category"
                  // onChange={(value) => handleSelectInput(value, 'categoryId')}
                  value={product && product['category'] && product['category']['id']}
                  options={categories}
                />
              </Col>
            </Row>
            <div className='feature-list-label-container'>
              <p className='feature-list-label-title'>List your features here</p>            
              <p className='feature-list-label-sub-title'>(Max user can add 6 features for more please UPDRAGE)</p>
            </div>
            {product && product.features && product && product.features.map((feature, index) => {
              const newFileList = [{
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: feature.attachmentUrl,
              }]
              return <Row gutter={12} className='features-row-container' key={`feature_${index}`}>
                <Col span={6}>
                  <FormInput 
                    label={`Feature label ${index+1}`}
                    // onChange={(event) => handleFeatureLabelInput(event, index)}
                    value={feature.label}
                    required={true}
                  />
                </Col>
                <Col span={10}>
                  <FormTextArea 
                    label={`Feature ${index+1}`}
                    // onChange={(event) => handleFeatureInput(event, index)}
                    value={feature.name}
                    required={true}
                  />
                </Col>
                <Col span={6}>
                  <Upload
                    // action=""
                    listType="picture-card"
                    fileList={newFileList}
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
            {product && product.features && product && product.features.length < 6 ? <div className='add-more-feature-lable' onClick={addNewFeatureToList}>+ Add More</div> : <></>}
            <div className="action-container">
              <button className='btn-primary'>Save as Draft</button>
              {product && product.id ? <button className='btn-primary' >Publish</button> : <></>}
              <button className='btn-plain' onClick={() => navigate('/', { replace: true })}>Cancel</button>
            </div>
          </div>
        </Col>
        <Col span={3}></Col>
      </Row>
    </>
  );
}
