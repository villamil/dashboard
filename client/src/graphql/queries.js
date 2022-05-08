import { gql } from "@apollo/client";

export const GET_BOOKS = gql`
  query Query {
    books {
      title
      author
    }
  }
`;

export const GET_PROJECTS = gql`
  query getProjects($data: JSONObject) {
    getProjects(data: $data) {
      _id
      name
      user {
        _id
        name
      }
      category
    }
  }
`;

export const GET_DATASETS = gql`
  query getDatasets {
    getDatasets {
      _id
      name
      description
      rootFolder
      ready
    }
  }
`;

export const GET_EXPERIMENTS = gql`
  query getExperiments {
    getExperiments {
      _id
      name
      image
      epochs
      splits
      status
      dataset {
        _id
        name
      }
      project {
        _id
        name
      }
    }
  }
`;

export const GET_VOLUNTEER_CONFIG = gql`
  query getVolunteerConfig {
    getVolunteerConfig {
      minio_endpoint
      minio_port
      minio_access_key
      minio_secret_key
      agent_manager_url
      agent_manager_port
    }
  }
`;

export const GET_CONNECTIONS = gql`
  query getConnections {
    getConnections {
      _id
      clientId
      status
      os
      user {
        name
      }
    }
  }
`;
