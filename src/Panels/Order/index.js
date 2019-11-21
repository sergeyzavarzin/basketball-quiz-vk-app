import React from 'react';
import moment from 'moment';
import {
  Panel, PanelHeader, HeaderButton,
  FormLayout, Input, Button, Checkbox,
  Textarea, Link, Counter, FormStatus, Group,
  List, Cell, Avatar
} from '@vkontakte/vkui';
import Icon24BrowserBack from '@vkontakte/icons/dist/24/browser_back';

import {withMarketContext} from '../../Contexts/MarketContext';
import {withAppContext} from '../../Contexts/AppContext';

import {ORDER_STATUSES} from '../../Constants/orderStatuses';
import {MERCH_TYPES} from '../../Constants/merchTypes';

const ERRORS = {
  VALIDATION: {
    title: 'Ошибка заполнения формы',
    body: 'Проверьте форму на наличие ошибок.'
  },
  PRICE: {
    title: 'Недостаточно баллов',
    body: 'Недостаточно баллов для совершения заказа.'
  }
};

class Order extends React.Component {

  state = {
    isValid: true,
    error: null,
    firstName: null,
    lastName: null,
    email: null,
    phone: null,
    country: null,
    city: null,
    address: null,
    postIndex: null,
    description: null,
    isAgree: false,
  };

  static getDerivedStateFromProps(nextProps) {
    const {appContext: {state: {user}}} = nextProps;
    if (user) {
      return {
        firstName: user.first_name,
        lastName: user.last_name,
        country: user.country.title,
        city: user.city.title,
      }
    }
  }

  handleChange = e => field => this.setState({[field]: e.currentTarget.value, isValid: true});

  isValid = () => {
    const {firstName, lastName, email, phone, country, city, address, postIndex, description} = this.state;
    return firstName && lastName && email && phone && country && city && address && postIndex && description;
  };

  handleSubmit = e => {
    const {go, marketContext, appContext} = this.props;
    const {state: {userScore, user}, updateUserData} = appContext;
    const {createOrder, fetchMerch, state: {selectedMerchItem}} = marketContext;
    if (userScore < selectedMerchItem.price) {
      this.setState({
        error: ERRORS.PRICE,
        isValid: false
      });
      return false;
    }
    if (selectedMerchItem.type === MERCH_TYPES.PHYSICAL && !this.isValid()) {
      this.setState({
        error: ERRORS.VALIDATION,
        isValid: false
      });
      return false;
    }
    const {email, phone, country, city, address, postIndex, description} = this.state;
    const deliveryData = JSON.stringify({email, phone, country, city, address, postIndex});
    const orderCreateCallback = () => {
      updateUserData();
      fetchMerch();
    };
    createOrder(
      `${selectedMerchItem.id}-${user.id}-${moment().format('DD-MM-YYYY-HH-mm-ss')}`,
      user.id, selectedMerchItem.id, selectedMerchItem.price,
      moment(), deliveryData, ORDER_STATUSES.CREATED, description || '', orderCreateCallback
    );
    go(e);
  };

  render() {
    const {handleChange, handleSubmit} = this;
    const {id, go, marketContext} = this.props;
    const {isValid, isAgree, firstName, lastName, country, city, error} = this.state;
    const {selectedMerchItem} = marketContext.state;
    const isPhysical = selectedMerchItem.type === MERCH_TYPES.PHYSICAL;
    return (
      <Panel id={id} theme='white'>
        <PanelHeader
          left={
            <HeaderButton data-to='market' onClick={go}>
              <Icon24BrowserBack/>
            </HeaderButton>
          }
        >
          Товар
        </PanelHeader>
        <Group title='Вы выбрали'>
          <List>
            <Cell
              size="l"
              before={<Avatar type='image' src={selectedMerchItem.image}/>}
              description={`${selectedMerchItem.price} баллов`}
              bottomContent={<span>В наличии: {selectedMerchItem.count} шт.</span>}
            >
              <b>{selectedMerchItem.name}</b>
            </Cell>
          </List>
        </Group>
        <FormLayout>
          {
            isPhysical &&
            <Input
              top='Имя'
              status={!firstName && !isValid && 'error'}
              defaultValue={firstName}
              onChange={e => handleChange(e)('firstName')}
            />
          }
          {
            isPhysical &&
            <Input
              top='Фамилия'
              defaultValue={lastName}
              onChange={e => handleChange(e)('lastName')}
            />
          }
          {
            isPhysical &&
            <Input
              top='E-mail'
              onChange={e => handleChange(e)('email')}
            />
          }
          {
            isPhysical &&
            <Input
              top='Телефон'
              onChange={e => handleChange(e)('phone')}
            />
          }
          {
            isPhysical &&
            <Input
              top='Страна'
              defaultValue={country}
              onChange={e => handleChange(e)('country')}
            />
          }
          {
            isPhysical &&
            <Input
              top='Город'
              defaultValue={city}
              onChange={e => handleChange(e)('city')}
            />
          }
          {
            isPhysical &&
            <Input
              top='Адрес'
              onChange={e => handleChange(e)('address')}
            />
          }
          {
            isPhysical &&
            <Input
              top='Почтовый индекс'
              onChange={e => handleChange(e)('postIndex')}
            />
          }
          {
            isPhysical &&
            <Textarea
              top='Пожелания'
              onChange={e => handleChange(e)('description')}
            />
          }
          {
            !isValid &&
            <FormStatus title={error.title} state='error'>
              {error.body}
            </FormStatus>
          }
          <Checkbox
            onChange={() => this.setState({isAgree: !isAgree})}
          >
            Согласен со всем <Link>этим</Link>
          </Checkbox>
          <Button
            level='commerce'
            size='xl'
            after={<Counter>{selectedMerchItem.price}</Counter>}
            data-to='purchases'
            onClick={handleSubmit}
            style={!isAgree ? {
              opacity: 0.5,
              pointerEvents: 'none',
              userSelect: 'none',
            } : {}}
          >
            Купить
          </Button>
        </FormLayout>
      </Panel>
    )
  }
}

export default withAppContext(withMarketContext(Order));