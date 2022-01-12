import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { GroupsList } from '@storysdk/react';
import withGroupsData from './hocs/withGroupsData';
import { API } from './services/API';
// import { adaptGroupData } from './utils/groupsAdapter';

import '@storysdk/react/dist/bundle.css';

export class Story {
  token: string;

  constructor(token: string) {
    this.token = token;
    axios.defaults.baseURL = 'https://api.diffapp.link/api/v1';

    if (token) {
      axios.defaults.headers.common = { Authorization: `SDK ${token}` };
    }
  }

  fetchGetApps = async () => {
    const { data } = await API.apps.getList();

    if (data.data && !data.error) {
      console.log(data.data);
    }
  };

  renderGroups(element?: Element | HTMLDivElement | null) {
    if (!this.token) {
      if (element) {
        ReactDOM.render(<p>StorySDK has not been initialized.</p>, element);
      } else {
        console.warn('StorySDK has not been initialized.');
      }

      return;
    }

    // this.fetchGetApps();

    // const dataGroups = JSON.stringify([
    //   {
    //     id: '6151c3c2be3952141639f90e',
    //     title: 'test',
    //     image_url:
    //       'https://storysdk.s3.eu-north-1.amazonaws.com/613b137d514fd8057b76f13f/1632748482177_d3848efa-a5a9-4095-a235-8160d18d368c.png',
    //     stories: [
    //       {
    //         id: '61c5304ecef08636cb8e5b10',
    //         creator_id: '613b137d514fd8057b76f13f',
    //         group_id: '61c14d470b02a5ed2e1672e6',
    //         status: 'draft',
    //         background: 'null',
    //         position: 1,
    //         story_data: {
    //           widgets: [
    //             {
    //               id: 'WrgqfCBi98Muped1riYo4I',
    //               position: {
    //                 x: 78,
    //                 y: 291,
    //                 width: 215,
    //                 height: 27,
    //                 rotate: 0
    //               },
    //               positionLimits: {
    //                 isResizableX: true,
    //                 isResizableY: false,
    //                 isAutoHeight: true,
    //                 isRotatable: true
    //               },
    //               content: {
    //                 type: 'text',
    //                 params: {
    //                   text: 'Your text',
    //                   fontFamily: 'Roboto',
    //                   fontSize: 44,
    //                   fontParams: {
    //                     style: 'normal',
    //                     weight: 400
    //                   },
    //                   align: 'center',
    //                   color: {
    //                     type: 'gradient',
    //                     value: ['rgba(71, 89, 250, 1)', 'rgba(194, 70, 255, 1)']
    //                   },
    //                   withFill: false,
    //                   opacity: 100,
    //                   widgetOpacity: 100,
    //                   backgroundColor: {
    //                     type: 'color',
    //                     value: '#ffffff'
    //                   },
    //                   backgroundOpacity: 100
    //                 }
    //               }
    //             }
    //           ],
    //           background: {
    //             type: 'gradient',
    //             value: ['rgb(0, 242, 254)', 'rgb(79, 172, 254)']
    //           }
    //         },
    //         statistic: {},
    //         created_at: '2021-12-24T02:28:30.666Z',
    //         updated_at: '2021-12-24T02:42:29.679Z'
    //       },
    //       {
    //         id: '61c530afcef08636cb8e5b11',
    //         creator_id: '613b137d514fd8057b76f13f',
    //         group_id: '61c14d470b02a5ed2e1672e6',
    //         status: 'draft',
    //         background: 'null',
    //         position: 2,
    //         story_data: {
    //           widgets: [
    //             {
    //               id: 'WRkAhGDLmzJ8PPhklwpbRK',
    //               position: {
    //                 rotate: 0,
    //                 x: 45,
    //                 y: 464,
    //                 width: 310,
    //                 height: 158
    //               },
    //               positionLimits: {
    //                 minWidth: 196,
    //                 maxWidth: 370,
    //                 minHeight: 100,
    //                 maxHeight: 189,
    //                 keepRatio: true,
    //                 ratioIndex: 1.96,
    //                 isResizableX: true,
    //                 isResizableY: true,
    //                 isRotatable: true
    //               },
    //               content: {
    //                 type: 'slider',
    //                 params: {
    //                   value: 50,
    //                   emoji: {
    //                     name: 'smiley_cat',
    //                     unicode: '1f63a'
    //                   },
    //                   text: 'How Are You?',
    //                   color: 'white'
    //                 }
    //               }
    //             }
    //           ],
    //           background: {
    //             type: 'video',
    //             value:
    //               'https://storysdk.s3.eu-north-1.amazonaws.com/613b137d514fd8057b76f13f/1640313006323_xJDDELfNg0h6G3lzWjSB3.mp4'
    //           }
    //         },
    //         statistic: {},
    //         created_at: '2021-12-24T02:30:07.36Z',
    //         updated_at: '2021-12-24T02:42:29.682Z'
    //       },
    //       {
    //         id: '61c530cb621e1b54957a5abd',
    //         creator_id: '613b137d514fd8057b76f13f',
    //         group_id: '61c14d470b02a5ed2e1672e6',
    //         status: 'draft',
    //         background: 'null',
    //         position: 3,
    //         story_data: {
    //           widgets: [
    //             {
    //               id: 'WJF12aq5WQEjZXH312y3CO',
    //               position: {
    //                 rotate: -14.749949229980587,
    //                 x: 42,
    //                 y: 459,
    //                 width: 295,
    //                 height: 135
    //               },
    //               positionLimits: {
    //                 minWidth: 196,
    //                 maxWidth: 370,
    //                 minHeight: 90,
    //                 maxHeight: 169,
    //                 ratioIndex: 2.18,
    //                 keepRatio: true,
    //                 isResizableX: true,
    //                 isResizableY: true,
    //                 isRotatable: true
    //               },
    //               content: {
    //                 type: 'question',
    //                 params: {
    //                   question: 'How Are You?',
    //                   confirm: 'Yes',
    //                   decline: 'No',
    //                   color: '#000000'
    //                 }
    //               }
    //             }
    //           ],
    //           background: {
    //             type: 'image',
    //             value:
    //               'https://storysdk.s3.eu-north-1.amazonaws.com/613b137d514fd8057b76f13f/1640313048559__6H3NAwaounRI4iM_fC5V.png',
    //             fileId: '61c530d80b02a5ed2e1672f9'
    //           }
    //         },
    //         statistic: {},
    //         created_at: '2021-12-24T02:30:35.084Z',
    //         updated_at: '2021-12-24T02:42:29.706Z'
    //       },
    //       {
    //         id: '61c530f00b02a5ed2e1672fa',
    //         creator_id: '613b137d514fd8057b76f13f',
    //         group_id: '61c14d470b02a5ed2e1672e6',
    //         status: 'draft',
    //         background: 'null',
    //         position: 4,
    //         story_data: {
    //           widgets: [
    //             {
    //               id: 'W7i3rsVZSIkleebRB0-d2m',
    //               position: {
    //                 rotate: 0,
    //                 x: 67,
    //                 y: 537,
    //                 width: 245,
    //                 height: 70
    //               },
    //               positionLimits: {
    //                 minWidth: 196,
    //                 maxWidth: 370,
    //                 minHeight: 50,
    //                 isResizableX: true,
    //                 isResizableY: true,
    //                 isRotatable: true
    //               },
    //               content: {
    //                 type: 'click_me',
    //                 params: {
    //                   text: 'Click Me',
    //                   fontFamily: 'Roboto',
    //                   fontSize: 22,
    //                   iconSize: 30,
    //                   color: {
    //                     type: 'color',
    //                     value: '#ffffff'
    //                   },
    //                   fontParams: {
    //                     style: 'normal',
    //                     weight: 400
    //                   },
    //                   opacity: 100,
    //                   borderOpacity: 100,
    //                   hasIcon: true,
    //                   borderRadius: 50,
    //                   backgroundColor: {
    //                     type: 'gradient',
    //                     value: ['rgb(255, 106, 40)', 'rgb(254, 47, 87)']
    //                   },
    //                   borderWidth: 2,
    //                   borderColor: {
    //                     type: 'color',
    //                     value: '#ffffff'
    //                   },
    //                   hasBorder: false,
    //                   url: '',
    //                   icon: {
    //                     name: 'LinksLineIcon'
    //                   }
    //                 }
    //               }
    //             }
    //           ],
    //           background: {
    //             type: 'color',
    //             value: 'rgba(120, 44, 224, 1)'
    //           }
    //         },
    //         statistic: {},
    //         created_at: '2021-12-24T02:31:12.452Z',
    //         updated_at: '2021-12-24T02:42:29.681Z'
    //       },
    //       {
    //         id: '61c53119621e1b54957a5abe',
    //         creator_id: '613b137d514fd8057b76f13f',
    //         group_id: '61c14d470b02a5ed2e1672e6',
    //         status: 'draft',
    //         background: 'null',
    //         position: 5,
    //         story_data: {
    //           widgets: [
    //             {
    //               id: 'WrIYUNyu2XLhNqFzG1bzQa',
    //               position: {
    //                 rotate: 0,
    //                 x: 71,
    //                 y: 278,
    //                 width: 260,
    //                 height: 169
    //               },
    //               positionLimits: {
    //                 minWidth: 196,
    //                 maxWidth: 370,
    //                 minHeight: 127,
    //                 maxHeight: 240,
    //                 isAutoHeight: true,
    //                 keepRatio: true,
    //                 ratioIndex: 1.54,
    //                 isResizableX: true,
    //                 isResizableY: true,
    //                 isRotatable: true
    //               },
    //               content: {
    //                 type: 'talk_about',
    //                 params: {
    //                   text: 'I talk about...',
    //                   image: null,
    //                   color: 'white'
    //                 }
    //               }
    //             }
    //           ],
    //           background: {
    //             type: 'gradient',
    //             value: ['rgb(243, 186, 227)', 'rgb(156, 186, 237)']
    //           }
    //         },
    //         statistic: {},
    //         created_at: '2021-12-24T02:31:53.49Z',
    //         updated_at: '2021-12-24T02:42:29.688Z'
    //       },
    //       {
    //         id: '61c5312d621e1b54957a5abf',
    //         creator_id: '613b137d514fd8057b76f13f',
    //         group_id: '61c14d470b02a5ed2e1672e6',
    //         status: 'draft',
    //         background: 'null',
    //         position: 6,
    //         story_data: {
    //           widgets: [
    //             {
    //               id: 'WW3TciSsE1FeRWo1JY5jbM',
    //               position: {
    //                 rotate: 0,
    //                 x: 66,
    //                 y: 302,
    //                 width: '100%',
    //                 height: 100
    //               },
    //               positionLimits: {
    //                 minHeight: 70,
    //                 minWidth: 70,
    //                 maxHeight: 130,
    //                 isResizableX: false,
    //                 isResizableY: true,
    //                 isRotatable: true
    //               },
    //               content: {
    //                 type: 'emoji_reaction',
    //                 params: {
    //                   color: 'orange',
    //                   emoji: [
    //                     {
    //                       name: 'star-struck',
    //                       unicode: '1f929'
    //                     },
    //                     {
    //                       name: 'thumbsup',
    //                       unicode: '1f44d'
    //                     },
    //                     {
    //                       name: 'fire',
    //                       unicode: '1f525'
    //                     }
    //                   ]
    //                 }
    //               }
    //             }
    //           ],
    //           background: {
    //             type: 'color',
    //             value: '#ffffff'
    //           }
    //         },
    //         statistic: {},
    //         created_at: '2021-12-24T02:32:13.718Z',
    //         updated_at: '2021-12-24T02:42:29.68Z'
    //       },
    //       {
    //         id: '61c5316bcef08636cb8e5b12',
    //         creator_id: '613b137d514fd8057b76f13f',
    //         group_id: '61c14d470b02a5ed2e1672e6',
    //         status: 'draft',
    //         background: 'null',
    //         position: 7,
    //         story_data: {
    //           widgets: [
    //             {
    //               id: 'WekJ2xH3m16ljEnq5PvOWL',
    //               position: {
    //                 rotate: 0,
    //                 x: 52,
    //                 y: 283,
    //                 width: 300,
    //                 height: 153
    //               },
    //               positionLimits: {
    //                 minWidth: 196,
    //                 minHeight: 100,
    //                 maxHeight: 189,
    //                 maxWidth: 370,
    //                 keepRatio: true,
    //                 ratioIndex: 1.96,
    //                 isResizableX: true,
    //                 isResizableY: true,
    //                 isRotatable: true,
    //                 isAutoHeight: true
    //               },
    //               content: {
    //                 type: 'timer',
    //                 params: {
    //                   time: 1640872800000,
    //                   text: 'New Year is coming soon',
    //                   color: 'purple'
    //                 }
    //               }
    //             }
    //           ],
    //           background: {
    //             type: 'color',
    //             value: 'rgba(210, 38, 38, 1)'
    //           }
    //         },
    //         statistic: {},
    //         created_at: '2021-12-24T02:33:15.978Z',
    //         updated_at: '2021-12-24T02:42:29.682Z'
    //       },
    //       {
    //         id: '61c53323cef08636cb8e5b13',
    //         creator_id: '613b137d514fd8057b76f13f',
    //         group_id: '61c14d470b02a5ed2e1672e6',
    //         status: 'draft',
    //         background: 'null',
    //         position: 8,
    //         story_data: {
    //           widgets: [
    //             {
    //               id: 'WV06-YLqruEAuiuswmyfbp',
    //               position: {
    //                 rotate: 0,
    //                 x: 42,
    //                 y: 173,
    //                 width: 300,
    //                 height: 215
    //               },
    //               positionLimits: {
    //                 minWidth: 196,
    //                 maxWidth: 370,
    //                 minHeight: 100,
    //                 isAutoHeight: true,
    //                 isResizableX: true,
    //                 isResizableY: true,
    //                 isRotatable: true
    //               },
    //               content: {
    //                 type: 'choose_answer',
    //                 params: {
    //                   text: 'Choose answer',
    //                   color: 'green',
    //                   markCorrectAnswer: false,
    //                   answers: [
    //                     {
    //                       id: 'A',
    //                       title: 'Answer 1'
    //                     },
    //                     {
    //                       id: 'B',
    //                       title: 'Answer 2'
    //                     },
    //                     {
    //                       id: 'C',
    //                       title: 'Answer 2'
    //                     },
    //                     {
    //                       id: 'D',
    //                       title: 'Answer 3'
    //                     }
    //                   ],
    //                   correct: 'D'
    //                 }
    //               }
    //             }
    //           ],
    //           background: {
    //             type: 'color',
    //             value: '#ffffff'
    //           }
    //         },
    //         statistic: {},
    //         created_at: '2021-12-24T02:40:35.557Z',
    //         updated_at: '2021-12-24T02:42:29.679Z'
    //       },
    //       {
    //         id: '61c53345cef08636cb8e5b14',
    //         creator_id: '613b137d514fd8057b76f13f',
    //         group_id: '61c14d470b02a5ed2e1672e6',
    //         status: 'draft',
    //         background: 'null',
    //         position: 9,
    //         story_data: {
    //           widgets: [
    //             {
    //               id: 'WJegC0Tt3T1xgm21l1QaEm',
    //               position: {
    //                 rotate: 0,
    //                 x: 93,
    //                 y: 579,
    //                 width: 210,
    //                 height: 34.796899999999994
    //               },
    //               positionLimits: {
    //                 minWidth: 100,
    //                 maxWidth: 370,
    //                 isResizableX: true,
    //                 isResizableY: true,
    //                 isAutoHeight: true,
    //                 isRotatable: true
    //               },
    //               content: {
    //                 type: 'swipe_up',
    //                 params: {
    //                   text: 'Swipe Up',
    //                   fontFamily: 'Roboto',
    //                   fontSize: 34,
    //                   iconSize: 33,
    //                   color: {
    //                     type: 'color',
    //                     value: '#000000'
    //                   },
    //                   opacity: 100,
    //                   fontParams: {
    //                     style: 'normal',
    //                     weight: 400
    //                   },
    //                   url: '',
    //                   icon: {
    //                     name: 'IconChevronCircleUp'
    //                   }
    //                 }
    //               }
    //             }
    //           ],
    //           background: {
    //             type: 'color',
    //             value: '#ffffff'
    //           }
    //         },
    //         statistic: {},
    //         created_at: '2021-12-24T02:41:09.898Z',
    //         updated_at: '2021-12-24T02:42:29.682Z'
    //       },
    //       {
    //         id: '61c5335dcef08636cb8e5b15',
    //         creator_id: '613b137d514fd8057b76f13f',
    //         group_id: '61c14d470b02a5ed2e1672e6',
    //         status: 'draft',
    //         background: 'null',
    //         position: 10,
    //         story_data: {
    //           widgets: [
    //             {
    //               id: 'WP3iBOO7XZF_qGblvhTvzW',
    //               position: {
    //                 x: 94,
    //                 y: 39,
    //                 width: 210,
    //                 height: 155,
    //                 rotate: 0
    //               },
    //               positionLimits: {
    //                 isResizableX: true,
    //                 isResizableY: true,
    //                 isRotatable: true
    //               },
    //               content: {
    //                 type: 'rectangle',
    //                 params: {
    //                   fillColor: {
    //                     type: 'color',
    //                     value: '#5E50B5'
    //                   },
    //                   fillBorderRadius: 5,
    //                   widgetOpacity: 100,
    //                   fillOpacity: 100,
    //                   strokeThickness: 3,
    //                   strokeColor: {
    //                     type: 'color',
    //                     value: 'rgba(241, 13, 202, 1)'
    //                   },
    //                   strokeOpacity: 100,
    //                   hasBorder: true
    //                 }
    //               }
    //             },
    //             {
    //               id: 'W8iuORqAiwFWfuJ_FHSVtU',
    //               position: {
    //                 x: 108,
    //                 y: 368,
    //                 width: 190,
    //                 height: 205,
    //                 rotate: 0
    //               },
    //               positionLimits: {
    //                 isResizableX: true,
    //                 isResizableY: true,
    //                 isRotatable: true
    //               },
    //               content: {
    //                 type: 'ellipse',
    //                 params: {
    //                   fillColor: {
    //                     type: 'color',
    //                     value: '#5E50B5'
    //                   },
    //                   fillOpacity: 100,
    //                   widgetOpacity: 100,
    //                   strokeThickness: 17,
    //                   strokeColor: {
    //                     type: 'color',
    //                     value: 'rgba(255, 0, 0, 1)'
    //                   },
    //                   strokeOpacity: 100,
    //                   hasBorder: true
    //                 }
    //               }
    //             }
    //           ],
    //           background: {
    //             type: 'color',
    //             value: '#ffffff'
    //           }
    //         },
    //         statistic: {},
    //         created_at: '2021-12-24T02:41:33.698Z',
    //         updated_at: '2021-12-24T02:42:29.683Z'
    //       },
    //       {
    //         id: '61c5338bcef08636cb8e5b16',
    //         creator_id: '613b137d514fd8057b76f13f',
    //         group_id: '61c14d470b02a5ed2e1672e6',
    //         status: 'draft',
    //         background: 'null',
    //         position: 11,
    //         story_data: {
    //           widgets: [
    //             {
    //               id: 'WGVg1nbzlsvCCiEY04l4Jrd',
    //               position: {
    //                 x: 58,
    //                 y: 187,
    //                 width: 275,
    //                 height: 305,
    //                 rotate: -7.131236134130461
    //               },
    //               positionLimits: {
    //                 minWidth: 20,
    //                 minHeight: 20,
    //                 isResizableX: true,
    //                 isResizableY: true,
    //                 isRotatable: true
    //               },
    //               content: {
    //                 type: 'giphy',
    //                 params: {
    //                   gif: 'https://media3.giphy.com/media/gNke2UrUTopOg/giphy.webp?cid=456fdcc6wl3lkm2ye3awk32qudn5ewzrho9aqci48nghwh21&rid=giphy.webp&ct=g',
    //                   widgetOpacity: 100,
    //                   borderRadius: 0
    //                 }
    //               }
    //             }
    //           ],
    //           background: {
    //             type: 'color',
    //             value: '#ffffff'
    //           }
    //         },
    //         statistic: {},
    //         created_at: '2021-12-24T02:42:19.437Z',
    //         updated_at: '2021-12-24T02:42:29.865Z'
    //       }
    //     ]
    //   }
    // ]);

    // const parsed = JSON.parse(dataGroups);
    // const groups = adaptGroupData(parsed);

    const Groups = withGroupsData(GroupsList, this.token);

    if (element) {
      ReactDOM.render(<Groups />, element);
    }
  }
}
