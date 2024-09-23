import { error } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
    try {
        const post = await locals.pocketbase.collection('posts').getOne(params.id);
        
        const comments = await locals.pocketbase.collection('comments').getList(1, 50, {
            filter: `post="${params.id}"`,
            expand: 'user,parent_comment',
            sort: '-created'
        });

        //console.log('Comments:', JSON.stringify(comments.items, null, 2));
        /* Comments: [
            {
              "collectionId": "yiov7qbdk1ynr1f",
              "collectionName": "comments",
              "content": "hahaha",
              "created": "2024-09-22 19:30:48.875Z",
              "expand": {
                "user": {
                  "avatar": "",
                  "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocJ2YoJXR7morq_Wfso8BEVSXCaHAyVLeD5K-lzvedrPPMaOSQ=s96-c",
                  "collectionId": "_pb_users_auth_",
                  "collectionName": "users",
                  "created": "2024-09-22 14:38:04.459Z",
                  "email": "vahidheydari0101@gmail.com",
                  "emailVisibility": false,
                  "id": "mezepgrshdd2dxp",
                  "name": "vahid heydari",
                  "updated": "2024-09-22 18:04:29.292Z",
                  "username": "users17974",
                  "verified": true
                }
              },
              "id": "bukr4tuti9xdnp9",
              "parent_comment": "",
              "post": "3zq0enall3ujc65",
              "updated": "2024-09-22 19:30:48.875Z",
              "user": "mezepgrshdd2dxp"
            },
            {
              "collectionId": "yiov7qbdk1ynr1f",
              "collectionName": "comments",
              "content": "kos",
              "created": "2024-09-22 19:30:34.710Z",
              "expand": {
                "parent_comment": {
                  "collectionId": "yiov7qbdk1ynr1f",
                  "collectionName": "comments",
                  "content": "hello",
                  "created": "2024-09-22 15:59:40.851Z",
                  "id": "5t6y2ajjl9qv0hf",
                  "parent_comment": "",
                  "post": "3zq0enall3ujc65",
                  "updated": "2024-09-22 19:13:57.287Z",
                  "user": "vkxrtzqorgte8f2"
                },
                "user": {
                  "avatar": "",
                  "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocJ2YoJXR7morq_Wfso8BEVSXCaHAyVLeD5K-lzvedrPPMaOSQ=s96-c",
                  "collectionId": "_pb_users_auth_",
                  "collectionName": "users",
                  "created": "2024-09-22 14:38:04.459Z",
                  "email": "vahidheydari0101@gmail.com",
                  "emailVisibility": false,
                  "id": "mezepgrshdd2dxp",
                  "name": "vahid heydari",
                  "updated": "2024-09-22 18:04:29.292Z",
                  "username": "users17974",
                  "verified": true
                }
              },
              "id": "nsp8v3o8dmnpi3t",
              "parent_comment": "5t6y2ajjl9qv0hf",
              "post": "3zq0enall3ujc65",
              "updated": "2024-09-22 19:30:34.710Z",
              "user": "mezepgrshdd2dxp"
            },
            {
              "collectionId": "yiov7qbdk1ynr1f",
              "collectionName": "comments",
              "content": "hello",
              "created": "2024-09-22 15:59:40.851Z",
              "expand": {
                "user": {
                  "avatar": "hhgmBZqH1aUW_NUy1Cgpf8S.jpeg",
                  "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocItubckXcSzF5RRi-ZFS9JuO0fwAnEVQKSvfzJqr07ic6pRCQ=s96-c",
                  "collectionId": "_pb_users_auth_",
                  "collectionName": "users",
                  "created": "2024-09-22 14:38:46.719Z",
                  "emailVisibility": false,
                  "id": "vkxrtzqorgte8f2",
                  "name": "omid barbari",
                  "updated": "2024-09-22 18:04:04.903Z",
                  "username": "users65124",
                  "verified": true
                }
              },
              "id": "5t6y2ajjl9qv0hf",
              "parent_comment": "",
              "post": "3zq0enall3ujc65",
              "updated": "2024-09-22 19:13:57.287Z",
              "user": "vkxrtzqorgte8f2"
            }
          ] */

        return {
            post,
            commentsData: comments.items
        };
    } catch (e) {
        console.error('Error loading post:', e);
        throw error(404, 'Post not found');
    }
};