import type { Schema, Attribute } from '@strapi/strapi';

export interface MesureMesureBsc extends Schema.Component {
  collectionName: 'components_bsc_mesure_bscs';
  info: {
    displayName: 'MesureBsc';
    description: '';
  };
  attributes: {
    composition: Attribute.Enumeration<['US', 'UM2', 'UM3']>;
    numMaterial: Attribute.String;
    questionnaireDistribuess: Attribute.Integer;
    questionnaireVides: Attribute.Integer;
    questionnaireInexploitables: Attribute.Integer;
    questionnaireExploitables: Attribute.Integer;
    retardDepart: Attribute.Integer;
    retardArrive: Attribute.Integer;
    gareMonte: Attribute.String;
    gareDescente: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'mesure.mesure-bsc': MesureMesureBsc;
    }
  }
}
