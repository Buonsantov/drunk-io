import { THEME_COLORS_ENUM } from '../../../_models/constants';

export class ModalOption {
  header?: string;
  closable?: boolean;
  body?: string;
  footer?: string;
  style?: {
    width?: string;
  };
  buttons!: {
    label: string;
    route?: string;
    style?: THEME_COLORS_ENUM;
    functionBtn?: any;
    value?: boolean;
  }[];
}



