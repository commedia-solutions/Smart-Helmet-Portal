// import { gql } from '@apollo/client'

// export const ON_UPDATE_HELMET = gql`
//   subscription OnUpdateSmartHelmet {
//     onUpdateSmartHelmet {
//     Device_ID
// 	Env_temp
// 	Obj_temp
// 	Hrt
// 	Gas
// 	lat
// 	lng

// 	datetime
// 	VOLATILE_GAS
// 	CARBON_MONOXIDE
// 	NITROGEN_DIOXIDE
// 	ALCOHOL
// 	Helmet_Status
//     }
//   }
// `


/// Today pp//
// import { gql } from "@apollo/client";

// export const ON_UPDATE_HELMET_READING = gql`
//   subscription OnUpdateHelmetReading($Device_ID: String) {
//     onUpdateHelmetReading(Device_ID: $Device_ID) {
//       Device_ID
//       ts
//       datetime
//       time
//       Env_temp
//       Obj_temp
//       Hrt
//       VOLATILE_GAS
//       CARBON_MONOXIDE
//       NITROGEN_DIOXIDE
//       ALCOHOL
//       Helmet_Status
//     }
//   }
// `;

// /**
//  * Your current AppSync schema does NOT define a Subscription type.
//  * So there is no valid subscription operation to run.
//  *
//  * We still export the name to avoid import/build errors.
//  * If you later add Subscription to AppSync, replace this with a real gql subscription.
//  */
// export const ON_UPDATE_HELMET = null as any;


///Today pp2//
// src/graphql/subscriptions.ts
import { gql } from '@apollo/client';

/**
 * Your current schema snippet doesn't define Subscription types.
 * Keep this placeholder so imports don't break.
 * When you add AppSync subscriptions, replace it here.
 */
export const PLACEHOLDER_SUBSCRIPTION = gql`
  subscription Placeholder {
    __typename
  }
`;
