import { ComponentType } from 'react';

import HostedCreditCardPaymentMethod from '../HostedCreditCardPaymentMethod';

import { NoUI } from './NoUI';

type ComponentMap = Record<string, ComponentType<any>>;

export const initializationComponentMap: ComponentMap = {
    card_ui: HostedCreditCardPaymentMethod,  // ativa la logica para que se vean los label tarjetas
    none: NoUI, 
};
