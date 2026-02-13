// src/graphql/queries.ts
import { gql } from '@apollo/client';

export const GET_LATEST = gql`
  query GetLatest($Device_ID: String!) {
    getLatest(Device_ID: $Device_ID) {
      Device_ID
      ts
      datetime
      time
      Env_temp
      Obj_temp
      Hrt
      VOLATILE_GAS
      CARBON_MONOXIDE
      NITROGEN_DIOXIDE
      ALCOHOL
      Helmet_Status
    }
  }
`;

export const GET_HISTORY = gql`
  query GetHistory($Device_ID: String!, $limit: Int) {
    getHistory(Device_ID: $Device_ID, limit: $limit) {
      Device_ID
      ts
      datetime
      time
      Env_temp
      Obj_temp
      Hrt
      VOLATILE_GAS
      CARBON_MONOXIDE
      NITROGEN_DIOXIDE
      ALCOHOL
      Helmet_Status
    }
  }
`;
