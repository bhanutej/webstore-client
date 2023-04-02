import React, { useEffect, useState } from 'react';
import { Button, Popconfirm, Table, notification, Spin } from 'antd';
import { useQuery, useMutation } from "@apollo/client";
import { LOAD_PRODUCTS } from '../../../GraphQL/Queries';
import { PUBLISH, UNPUBLISH_APPLICATION_MUTATION } from '../../../GraphQL/Mutations';
import { useNavigate } from 'react-router-dom';

export const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const {loading, data, error} = useQuery(LOAD_PRODUCTS, {
    variables: { limit: 20, status: 'all' },
  });
  const [unPblishApplication] = useMutation(UNPUBLISH_APPLICATION_MUTATION, {
    refetchQueries: [
      {
        query: LOAD_PRODUCTS, variables: { limit: 20, status: 'all'  }
      }
    ]
  });
  
  const [pblishApplication] = useMutation(PUBLISH, {
    refetchQueries: [
      {
        query: LOAD_PRODUCTS, variables: { limit: 20, status: 'all'  }
      }
    ]
  });

  const openNotification = (type, placement, message) => {
    notification[type]({
      message,
      placement,
    });
  };

  console.log(error);

  const handleUnPublishApplication = (productId) => {
    unPblishApplication({
      variables: { productId }
    })
    .then(res => {
      openNotification('success', 'topRight', res.data.unPublish.message);
    })
    .catch(error => {
      openNotification('info', 'topRight', error.message);
    });
  }
  
  const handlePublishApplication = (productId) => {
    pblishApplication({
      variables: { productId }
    })
    .then(res => {
      openNotification('success', 'topRight', res.data.publish.message);
    })
    .catch(error => {
      openNotification('info', 'topRight', error.message);
    });
  }

  const navigateToProduct = (productId) => {
    navigate(`/productView/${productId}`);
  }

  const tableColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Company',
      dataIndex: 'companyName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Contact Person',
      dataIndex: 'contactPerson',
    },
    {
      title: 'Contact',
      dataIndex: 'contact',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
          {record.status === 'pending' ? 
          <Button onClick={() => handlePublishApplication(record.id)}>Publish</Button>
          : <Button onClick={() => handleUnPublishApplication(record.id)}>Un publish</Button>
        }
          <Button onClick={() => navigateToProduct(record.id)}>View</Button>
          <Popconfirm title="Sure to delete?" onConfirm={() => (record.id)}>
            <Button>Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];
  
  useEffect(() => {
    if (data && data.products) {
      setProducts(data.products);
    }
  }, [data]);

  return (
    <>
      <div>ProductList: {products.length}</div>
      {loading && <Spin />}
      <Table columns={tableColumns} dataSource={products} size="small" />
    </>
  )
}
