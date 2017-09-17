const graphql = require('graphql');
const axios = require('axios');
const {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} = graphql;

const AlbumType = new GraphQLObjectType({
  name: 'Album',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    artist: {
      type: ArtistType,
      resolve(parentValue, args) {
        return axios.get(`http://json-server:3000/artists/${parentValue.artist_id}`)
          .then(res => res.data)
      }
    }
  })
});

const ArtistType = new GraphQLObjectType({
  name: 'Artist',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    albums: {
      type: new GraphQLList(AlbumType),
      resolve(parentValue, args) {
        return axios.get(`http://json-server:3000/artists/${parentValue.id}/albums`)
          .then(res => res.data)
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    reviews: {
      type: new GraphQLList(ReviewType),
      resolve(parentValue, args) {
        return axios.get(`http://json-server:3000/users/${parentValue.id}/reviews`)
          .then(res => res.data);
      }
    }
  })
});

const ReviewType = new GraphQLObjectType({
  name: 'Review',
  fields: () => ({
    id: { type: GraphQLString },
    rating: { type: GraphQLInt },
    album: {
      type: AlbumType,
      resolve(parentValue, args) {
        return axios.get(`http://json-server:3000/albums/${parentValue.album_id}`)
          .then(res => res.data);
      }
    },
    user: {
      type: UserType,
      resolve(parentValue, args) {
        return axios.get(`http://json-server:3000/users/${parentValue.user_id}`)
          .then(res => res.data);
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    album: {
      type: AlbumType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://json-server:3000/albums/${args.id}`)
          .then(resp => resp.data);
      }
    },
    artist: {
      type: ArtistType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://json-server:3000/artists/${args.id}`)
          .then(resp => resp.data);
      }
    },
    review: {
      type: ReviewType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://json-server:3000/reviews/${args.id}`)
          .then(resp => resp.data);
      }
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://json-server:3000/users/${args.id}`)
          .then(resp => resp.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
