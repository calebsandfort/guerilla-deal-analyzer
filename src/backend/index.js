import "./config";

import cors from "cors";
import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import schema from "./schema";
import resolvers from "./resolvers";
import models, { sequelize } from "./models";
import { formatValidationError } from "./utilities/logging";
// import DataLoader from 'dataloader';
// import loaders from './loaders';

const app = express();
app.use(cors());

const server = new ApolloServer({
  introspection: true,
  playground: true,
  typeDefs: schema,
  resolvers,
  context: async ({ req, connection }) => {
    if (connection) {
      return {
        models
        // loaders: {
        //   team: new DataLoader(keys =>
        //     loaders.team.batchTeams(keys, models),
        //   ),
        // },
      };
    }

    if (req) {
      return {
        models
        // loaders: {
        //   team: new DataLoader(keys =>
        //     loaders.team.batchTeams(keys, models),
        //   ),
        // },
      };
    }
  },
  formatError: error => {
    // console.log("*******************************errro");
    // console.log(JSON.stringify(error));

    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message.replace("SequelizeValidationError: ", "").replace("Validation error: ", "");

    if (!formatValidationError(error)) {
      return {
        ...error,
        message
      };
    }
  },
  formatResponse: response => {
    // console.log(response);
    return response;
  }
});

server.applyMiddleware({ app, path: "/graphql" });

const eraseDatabaseOnSync = true;

sequelize
  .sync({
    // force: eraseDatabaseOnSync
    alter: true
  })
  .then(async () => {
    if (eraseDatabaseOnSync) {
      //seedTeams();
    }

    app.listen({ port: 5050 }, () => {
      console.log("Apollo Server on http://localhost:5050/graphql");
    });
  });

// const seedTeams = async () => {
//   await models.Team.create(
//     {
//       name: 'Los Angeles Lakers',
//       bbref_id: 'LAL'
//     },
//   );
// };
