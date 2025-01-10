import { gql } from '@apollo/client';

// Normal Query: get user info
export const GET_USER_INFO = gql`
  query GetUserDetails {
    user {
      id
      login
      email
      createdAt
      updatedAt
      firstName
      lastName
    }
  }
`;

// Argument-based Query: get total xp
export const GEt_Total_XPInKB = gql`
query GetTotalXPInKB($userId: Int!) {
  transaction_aggregate(where: { userId: { _eq: $userId }, type: { _eq: "xp" } }) {
    aggregate {
      sum {
        amount
      }
    }
  }
}
`;

// Argument-based Query: get progress by userId
export const GET_DETAILED_XP = gql`
query GetDetailedXP($userId: Int!) {
  piscineGoXP: transaction_aggregate(
    where: {
      userId: { _eq: $userId },
      type: { _eq: "xp" },
      path: { _like: "%bh-piscine%" }
    }
  ) {
    aggregate {
      sum {
        amount
      }
    }
  }
  piscineJsXP: transaction_aggregate(
    where: {
      userId: { _eq: $userId },
      type: { _eq: "xp" },
      path: { _like: "%piscine-js%" }
    }
  ) {
    aggregate {
      sum {
        amount
      }
    }
  }
  projectXP: transaction_aggregate(
    where: {
      userId: { _eq: $userId },
      type: { _eq: "xp" },
      object: { type: { _eq: "project" } }
    }
  ) {
    aggregate {
      sum {
        amount
      }
    }
  }
}
`;

export const GET_PROJECTS_WITH_XP = gql`
  query GetProjectsAndXP($userId: Int!) {
    transaction(
      where: {
        userId: { _eq: $userId },
        type: { _eq: "xp" },
        object: { type: { _eq: "project" } }
      }
        order_by: { createdAt: asc }
    ) {
      id
      object {
        name
      }
      amount
      createdAt
    }
  }
`;

export const GET_PROJECTS_PASS_FAIL = gql`
  query GetProjectsPassFail($userId: Int!) {
    progress(where: { userId: { _eq: $userId }, object: { type: { _eq: "project" } } }) {
      grade
    }
  }
`;

export const GET_LATEST_PROJECTS_WITH_XP =gql`query GetLatestProjectsAndXP($userId: Int!) {
  transaction(
    where: {
      userId: { _eq: $userId },
      type: { _eq: "xp" },
      object: { type: { _eq: "project" } }
    }
    order_by: { createdAt: desc }
    limit: 12
  ) {
    id
    object {
      name
    }
    amount
    createdAt
  }
}
  `;




