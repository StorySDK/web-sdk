import React, { useState, useEffect } from 'react';
import { GroupType } from '@storysdk/react';
import { API } from '../services/API';
import { adaptGroupData } from '../utils/groupsAdapter';

interface GroupsListProps {
  groups: GroupType[];
}

const withGroupsData = (GroupsList: React.FC<GroupsListProps>, token: string) => () => {
  const [data, setData] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groupsWithStories, setGroupsWithStories] = useState([]);
  const [loadStatus, setLoadStatus] = useState('pending');

  useEffect(() => {
    setLoadStatus('loading');

    API.apps.getList().then((appData) => {
      if (!appData.data.error) {
        const app = appData.data.data.filter((item: any) => item.sdk_token === token);
        const appId = app.length ? app[0].id : '';

        API.groups.getList({ appId }).then((groupsData) => {
          if (!groupsData.data.error) {
            const groupsFetchedData = groupsData.data.data
              .filter((item: any) => item.active)
              .map((item: any) => ({
                id: item.id,
                app_id: item.app_id,
                title: item.title,
                image_url: item.image_url
              }));

            setGroups(groupsFetchedData);
            setGroupsWithStories(groupsFetchedData);
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    if (groups.length) {
      groups.forEach((groupItem: any, groupIndex: number) => {
        API.stories
          .getList({
            appId: groupItem.app_id,
            groupId: groupItem.id
          })
          .then((storiesData) => {
            if (!storiesData.data.error) {
              const stories = storiesData.data.data.filter(
                (storyItem: any) => storyItem.status === 'active'
              );

              // @ts-ignore
              setGroupsWithStories((prevState) =>
                prevState.map((item: any) => {
                  if (item.id === groupItem.id) {
                    return { ...item, stories };
                  }

                  return item;
                })
              );

              if (groupIndex === groups.length - 1) {
                setLoadStatus('loaded');
              }
            }
          });
      });
    }
  }, [groups]);

  useEffect(() => {
    if (loadStatus === 'loaded' && groupsWithStories.length) {
      const adaptedData = adaptGroupData(groupsWithStories);

      setData(adaptedData);
    }
  }, [loadStatus, groupsWithStories]);

  return <GroupsList groups={data} />;
};

export default withGroupsData;
