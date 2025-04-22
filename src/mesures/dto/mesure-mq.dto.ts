// mesure-mq.dto.ts
import { ApiProperty } from '@nestjs/swagger';


export class MesureMqDto {
  @ApiProperty()
  mileage: number;

  @ApiProperty()
  numberPlate: string;

  @ApiProperty()
  busBrand: string;

  @ApiProperty()
  driverBadge: boolean;

  @ApiProperty()
  usb: boolean;

  @ApiProperty()
  onBoardConfort: boolean;

  @ApiProperty()
  ticketCheck: boolean;

  @ApiProperty()
  applicationLocaliTER: boolean;

  @ApiProperty()
  destinationDisplay: boolean;

  @ApiProperty()
  routeIndicator: boolean;

  @ApiProperty()
  wheelchairRamp: boolean;

  @ApiProperty()
  busLoad: boolean;

  @ApiProperty()
  outdoorCleanliness: boolean;

  @ApiProperty()
  intdoorCleanliness: boolean;

  @ApiProperty()
  intdoorState: boolean;

  @ApiProperty()
  outdoorState: boolean;

  @ApiProperty()
  ontimeDeparture: boolean;

  @ApiProperty()
  itinerary: boolean;

  @ApiProperty()
  availabilityAtThePlatform: boolean;

  @ApiProperty()
  commercialBehavior: boolean;

  @ApiProperty()
  uniform: boolean;

  @ApiProperty()
  drivingBehavior: boolean;

  @ApiProperty()
  comment: string;
}
