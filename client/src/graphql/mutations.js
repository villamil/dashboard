import { gql } from "@apollo/client";

export const CREATE_PROJECT = gql`
  mutation ($data: JSONObject) {
    createProject(data: $data) {
      _id
    }
  }
`;

export const CREATE_EXPERIMENT = gql`
  mutation ($data: JSONObject) {
    createExperiment(data: $data) {
      _id
    }
  }
`;
