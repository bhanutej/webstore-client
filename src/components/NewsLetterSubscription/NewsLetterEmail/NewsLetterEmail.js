import React, { useEffect, useState } from 'react';
import { Button, Popconfirm, Table, notification } from 'antd';
import { useQuery, useMutation } from "@apollo/client";
import { LOAD_NEWS_LETTER_EMAILS } from "../../../GraphQL/Queries";
import { DELETE_NEWS_SUBSCRIBER_MUTATION } from '../../../GraphQL/Mutations';
import { Spin } from 'antd';
import './NewsLetterEmail.css';

export const NewsLetterEmail = () => {
  const [newsLetterEmails, setNewsLetterEmails] = useState([]);
  const [deleteNewsSubscriber] = useMutation(DELETE_NEWS_SUBSCRIBER_MUTATION, {
    refetchQueries: [
      {
        query: LOAD_NEWS_LETTER_EMAILS, variables: { limit: 20 }
      }
    ]
  });
  const {loading, data, error} = useQuery(LOAD_NEWS_LETTER_EMAILS, {
    variables: { limit: 20 },
  });
  const openNotification = (type, placement, message) => {
    notification[type]({
      message,
      placement,
    });
  };

  console.log(error);

  const tableColumns = [
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Popconfirm title="Sure to delete?" onConfirm={() => handleEmailDelete(record.id)}>
          <Button>Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  const handleEmailDelete = (newLetterEmailId) => {
    console.log("newLetterEmailId", newLetterEmailId);
    deleteNewsSubscriber({
      variables: {
        id: newLetterEmailId
      }
    })
    .then(res => {
      openNotification('success', 'topRight', res.data.deleteNewsSubscriber.message);
    })
    .catch(error => {
      openNotification('info', 'topRight', error.message);
    });
  }

  useEffect(() => {
    if (data && data.newsLetterEmails) {
      setNewsLetterEmails(data.newsLetterEmails);
    }
  }, [data, newsLetterEmails]);

  return (
    <div className="news-letter-layout-container">
      <div id="post_news_button_container">
        <Button type='primary' >Post news</Button>
      </div>
      {loading && <Spin />}
      <Table columns={tableColumns} dataSource={newsLetterEmails} size="small" />
    </div>
  )
}
