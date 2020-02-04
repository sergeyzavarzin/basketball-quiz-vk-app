import React from 'react';
import moment from 'moment';
import {Cell, List, Group, PanelHeader, Panel, PullToRefresh, Tabs, TabsItem, FixedLayout} from '@vkontakte/vkui';

import MatchItem from '../../Components/Match';

import {withAppContext} from '../../Contexts/AppContext';
import {MATCH_TYPES} from '../../Constants/matchTypes';

const Matches = ({id, go, appContext}) => {
  const {state, setActiveMatch, updateMatches, setValue} = appContext;
  const {matches, rivals, isMatchesFetching, matchesSelectedTab} = state;
  const sortByDateDESC = (a, b) => moment.utc(a.startDateTime).diff(moment.utc(b.startDateTime));
  const sortByDateASC = (a, b) => moment.utc(b.startDateTime).diff(moment.utc(a.startDateTime));
  const upcomingMatches = matches
    .filter(match => !match.score.length)
    .sort(sortByDateDESC);
  const endedMatches = matches
    .filter(match => match.score.length)
    .sort(sortByDateASC);
  const viewMatchInfo = (event, activeMatch) => {
    setActiveMatch(activeMatch);
    go(event);
  };
  return (
    <Panel id={id}>
      <PanelHeader>
        Матчи
      </PanelHeader>
      <FixedLayout vertical='bottom'>
        <Tabs type='default'>
          <TabsItem
            onClick={() => setValue('matchesSelectedTab')(MATCH_TYPES.NOT_STARTED)}
            selected={matchesSelectedTab === MATCH_TYPES.NOT_STARTED}
          >
            Предстоящие
          </TabsItem>
          <TabsItem
            onClick={() => setValue('matchesSelectedTab')(MATCH_TYPES.ENDED)}
            selected={matchesSelectedTab === MATCH_TYPES.ENDED}
          >
            Завершенные
          </TabsItem>
        </Tabs>
      </FixedLayout>
      <PullToRefresh
        onRefresh={updateMatches}
        isFetching={isMatchesFetching}
      >
        <div style={{marginBottom: 56}}>
          {
            (!!upcomingMatches.length && matchesSelectedTab === MATCH_TYPES.NOT_STARTED) &&
            <Group>
              <List>
                {
                  upcomingMatches
                    .map(match =>
                      <Cell
                        key={match.id}
                        size="l"
                      >
                        <MatchItem
                          rival={rivals.find(rival => rival.id === match.rivalId)}
                          beginTime={match.startDateTime}
                          place={match.place}
                          buyTickets={match.buyTicketsUrl}
                        />
                      </Cell>
                    )
                }
              </List>
            </Group>
          }
          {
            (!!endedMatches.length && matchesSelectedTab === MATCH_TYPES.ENDED) &&
            <Group>
              <List>
                {
                  endedMatches
                    .map(match =>
                      <Cell
                        key={match.id}
                        size="l"
                        expandable
                        data-to='match-view'
                        onClick={e => viewMatchInfo(e, match)}
                      >
                        <MatchItem
                          rival={rivals.find(rival => rival.id === match.rivalId)}
                          beginTime={match.startDateTime}
                          place={match.place}
                          game={match.score}
                        />
                      </Cell>
                    )
                }
              </List>
            </Group>
          }
        </div>
      </PullToRefresh>
    </Panel>
  );
};

export default withAppContext(Matches);
