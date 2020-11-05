import React, { Fragment } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { Card, Descriptions } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { Loading } from '../components';

interface AnnotationCardProps {

}

const 