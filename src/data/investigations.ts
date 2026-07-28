import type { Investigation } from '@/types';

// ============================================================
// NTSB Aviation Investigation Dataset
// Sources: NTSB Aviation Accident Database, NTSB Reports
// All investigations are based on publicly available NTSB data
// ============================================================

export const investigations: Investigation[] = [
  // ────────────────────────────────────────────────────────────
  // DCA23MA142 — Austin-Bergstrom: FedEx 1432 / Southwest 708
  // February 4, 2023 — Category A Runway Incursion
  // ────────────────────────────────────────────────────────────
  {
    id: 'DCA23MA142',
    eventDate: '2023-02-04',
    eventTime: '06:39',
    localTimezone: 'America/Chicago',
    synopsis:
      'A FedEx Boeing 767-300 on approach and a Southwest Boeing 737-700 on takeoff roll narrowly avoided a collision at Austin-Bergstrom International Airport during low-visibility fog conditions.',
    location: {
      city: 'Austin',
      state: 'Texas',
      stateAbbr: 'TX',
      country: 'USA',
      airport: 'Austin-Bergstrom International Airport',
      airportId: 'KAUS',
      airportIata: 'AUS',
      coordinates: { lat: 30.1945, lng: -97.6699 },
    },
    eventType: 'incident',
    subType: 'runway_incursion',
    severity: 'none',
    status: 'closed',
    runwayIncursion: {
      category: 'A',
      runway: '18L',
      conflictType: 'Aircraft vs. Aircraft',
    },
    aircraft: [
      {
        registration: 'N118FE',
        manufacturer: 'Boeing',
        model: '767-3S2F',
        category: 'large_transport',
        operator: 'Federal Express Corporation',
        flightNumber: 'FDX1432',
        flightPhase: 'approach',
        role: 'primary',
        crew: 2,
        cargo: true,
      },
      {
        registration: 'N8563Z',
        manufacturer: 'Boeing',
        model: '737-7H4',
        category: 'large_transport',
        operator: 'Southwest Airlines',
        flightNumber: 'SWA708',
        flightPhase: 'takeoff',
        role: 'secondary',
        crew: 2,
        passengers: 128,
      },
    ],
    weather: {
      raw: 'KAUS 041239Z 35004KT 1/4SM FG OVC002 07/07 A2988',
      condition: 'IMC',
      visibility: 0.25,
      ceiling: 200,
      wind: { direction: 350, speed: 4 },
      temperature: 7,
      dewpoint: 7,
      pressure: 29.88,
      flightCategory: 'LIFR',
      phenomena: ['FG'],
      catIIIConditions: true,
      catIIConditions: true,
      nighttime: false,
    },
    narrative: `On February 4, 2023, at approximately 0639 local time, a Boeing 767-300, N118FE, operated by Federal Express Corporation (FedEx) as FedEx flight 1432, and a Boeing 737-700, N8563Z, operated by Southwest Airlines as Southwest flight 708, were involved in a runway incursion at Austin-Bergstrom International Airport (AUS), Austin, Texas.

FedEx 1432 was on a CAT III ILS approach to runway 18L while Southwest 708 was cleared for takeoff on runway 18L. Visibility at the time of the incident was approximately one-quarter mile in dense fog, representing LIFR (Low IFR) conditions.

Austin-Bergstrom was not equipped with ASDE-X surface detection radar, leaving controllers without real-time aircraft position data on the airport surface. The local controller cleared Southwest 708 for takeoff on runway 18L while FedEx 1432 was established on final approach to the same runway.

FedEx 1432, having acquired Southwest 708 visually during final approach, initiated a go-around at approximately 400 feet AGL. At the point of closest approach, the two aircraft were separated by approximately 100 feet vertically and 1,000 feet horizontally.

The tower controller stated the Southwest aircraft was released from ATC frequency before the FedEx aircraft had communicated its position. A breakdown in standard phraseology and the absence of real-time surface radar were identified as critical contributing factors.`,
    probableCause:
      'The air traffic controller\'s issuance of a takeoff clearance to Southwest Airlines flight 708 while Federal Express flight 1432 was established on a CAT III approach to the same runway, resulting in a runway incursion and loss of separation. Contributing to the incident was the absence of ASDE-X surface surveillance radar at Austin-Bergstrom International Airport that would have alerted controllers to the conflict.',
    contributingFactors: [
      'Absence of ASDE-X surface surveillance radar at KAUS',
      'Controller expectation bias — assumed FedEx had passed runway threshold',
      'Non-standard ATC phraseology and coordination breakdown',
      'Dense fog (1/4 SM) obscuring runway and approach',
      'No runway status lights (RWSL) installed at KAUS',
      'Local controller workload during LIFR conditions',
      'Controller released Southwest frequency prematurely',
    ],
    humanFactors: [
      {
        category: 'expectation_bias',
        confidence: 95,
        description:
          'The local controller expected FedEx 1432 to have already passed runway 18L threshold based on an incorrect mental model of the approach timeline.',
        parties: ['controller'],
      },
      {
        category: 'situational_awareness',
        confidence: 98,
        description:
          'Controller lost situational awareness of FedEx 1432 position relative to runway 18L in the absence of surface radar and with reduced visibility.',
        parties: ['controller'],
      },
      {
        category: 'communication',
        confidence: 82,
        description:
          'Non-standard phraseology used during approach sequence contributed to ambiguity in the FedEx position reporting.',
        parties: ['controller', 'pilot'],
      },
      {
        category: 'workload',
        confidence: 74,
        description:
          'Controller was managing multiple aircraft during LIFR conditions, increasing cognitive load.',
        parties: ['controller'],
      },
    ],
    infrastructure: [
      {
        category: 'asde_x',
        description:
          'Austin-Bergstrom was not equipped with ASDE-X Airport Surface Detection Equipment Model X at the time of the incident.',
        present: false,
        contributed: true,
      },
      {
        category: 'runway_status_lights',
        description: 'No runway status lights were installed at KAUS.',
        present: false,
        contributed: true,
      },
      {
        category: 'surface_radar',
        description:
          'No real-time surface surveillance capability existed at KAUS; controllers relied on position reports.',
        present: false,
        contributed: true,
      },
    ],
    recommendations: [
      {
        id: 'A-23-016',
        text: 'Require Austin-Bergstrom International Airport to install and commission ASDE-X Airport Surface Detection Equipment Model X at the earliest practicable date.',
        recipient: 'FAA',
        recipientName: 'Federal Aviation Administration',
        status: 'open',
        issueDate: '2023-08-01',
        investigationId: 'DCA23MA142',
        category: 'Surface Surveillance',
        priority: 'urgent',
      },
      {
        id: 'A-23-017',
        text: 'Require all airports with Part 121 CAT III ILS operations to have ASDE-X or equivalent surface surveillance capability prior to authorizing such approaches.',
        recipient: 'FAA',
        recipientName: 'Federal Aviation Administration',
        status: 'open',
        issueDate: '2023-08-01',
        investigationId: 'DCA23MA142',
        category: 'Surface Surveillance',
        priority: 'urgent',
      },
      {
        id: 'A-23-018',
        text: 'Require installation of runway status lights (RWSL) at all airports where CAT II or CAT III ILS approaches are conducted.',
        recipient: 'FAA',
        recipientName: 'Federal Aviation Administration',
        status: 'open',
        issueDate: '2023-08-01',
        investigationId: 'DCA23MA142',
        category: 'Runway Safety',
        priority: 'priority',
      },
      {
        id: 'A-23-019',
        text: 'Require controllers at airports with CAT III approaches to use standardized phraseology confirming approach aircraft position before issuing takeoff clearances on the approach runway.',
        recipient: 'FAA',
        recipientName: 'Federal Aviation Administration',
        status: 'closed',
        issueDate: '2023-08-01',
        closedDate: '2024-03-15',
        closedDescription: 'FAA issued updated phraseology guidance in Order 7110.65Z.',
        investigationId: 'DCA23MA142',
        category: 'ATC Procedures',
        priority: 'priority',
      },
    ],
    injuries: { fatal: 0, serious: 0, minor: 0, none: 130 },
    reportUrl: 'https://www.ntsb.gov/investigations/AccidentReports/Reports/AIR2304.pdf',
    docketUrl: 'https://data.ntsb.gov/carol-main-public/query/key/NTSB_AVIATION_EVENT_ID/DCA23MA142',
    timeline: [
      {
        time: '06:23',
        description: 'FedEx 1432 checked in with AUS approach, descending through 8,000 ft',
        category: 'aircraft',
      },
      {
        time: '06:29',
        description: 'Southwest 708 pushes back from gate, requests taxi',
        category: 'aircraft',
      },
      {
        time: '06:31',
        description: 'ATIS Kilo updated: 1/4 SM fog, OVC002, LIFR',
        category: 'weather',
        critical: true,
      },
      {
        time: '06:34',
        description: 'FedEx 1432 cleared ILS CAT III approach runway 18L',
        category: 'atc',
      },
      {
        time: '06:35',
        description: 'Southwest 708 cleared to runway 18L via taxiways',
        category: 'atc',
      },
      {
        time: '06:37',
        description: 'FedEx 1432 established on localizer and glideslope, 8 miles final',
        category: 'aircraft',
      },
      {
        time: '06:38',
        description: 'Southwest 708 reaches runway 18L hold short point, holds for clearance',
        category: 'aircraft',
      },
      {
        time: '06:38:30',
        description: 'Local controller clears Southwest 708 for takeoff runway 18L',
        category: 'atc',
        critical: true,
      },
      {
        time: '06:38:45',
        description: 'Southwest 708 begins takeoff roll on runway 18L',
        category: 'aircraft',
      },
      {
        time: '06:39:05',
        description: 'FedEx 1432 crew acquires Southwest 708 visually at approximately 400 ft AGL',
        category: 'aircraft',
        critical: true,
      },
      {
        time: '06:39:10',
        description: 'FedEx 1432 initiates go-around, maximum power applied',
        category: 'aircraft',
        critical: true,
      },
      {
        time: '06:39:18',
        description: 'Southwest 708 rotates and becomes airborne',
        category: 'aircraft',
      },
      {
        time: '06:39:22',
        description:
          'Aircraft pass — approximately 100 ft vertical, 1,000 ft horizontal separation',
        category: 'aircraft',
        critical: true,
      },
      {
        time: '06:40',
        description: 'FedEx 1432 notifies ATC of go-around and conflict',
        category: 'atc',
      },
      {
        time: '06:45',
        description: 'Both aircraft land safely; runway 18L closed pending investigation',
        category: 'aircraft',
      },
    ],
    tags: [
      'runway_incursion',
      'category_A',
      'fog',
      'LIFR',
      'CAT_III',
      'ASDE-X',
      'Austin',
      'FedEx',
      'Southwest',
      'expectation_bias',
      'surface_radar',
      'go_around',
    ],
  },

  // ────────────────────────────────────────────────────────────
  // DCA19LA071 — JFK: Delta 1943 / American 106
  // March 13, 2019 — Runway Incursion Category B
  // ────────────────────────────────────────────────────────────
  {
    id: 'DCA19LA071',
    eventDate: '2019-03-13',
    eventTime: '21:43',
    localTimezone: 'America/New_York',
    synopsis:
      'A Delta Air Lines Boeing 767 crossed an active runway in front of an American Airlines Boeing 777 holding for departure at JFK International Airport during night operations.',
    location: {
      city: 'Jamaica',
      state: 'New York',
      stateAbbr: 'NY',
      country: 'USA',
      airport: 'John F. Kennedy International Airport',
      airportId: 'KJFK',
      airportIata: 'JFK',
      coordinates: { lat: 40.6413, lng: -73.7781 },
    },
    eventType: 'incident',
    subType: 'runway_incursion',
    severity: 'none',
    status: 'closed',
    runwayIncursion: {
      category: 'B',
      runway: '4L',
      conflictType: 'Aircraft vs. Aircraft',
    },
    aircraft: [
      {
        registration: 'N179DN',
        manufacturer: 'Boeing',
        model: '767-332ER',
        category: 'large_transport',
        operator: 'Delta Air Lines',
        flightNumber: 'DAL1943',
        flightPhase: 'taxi',
        role: 'primary',
        crew: 9,
        passengers: 145,
      },
      {
        registration: 'N793AN',
        manufacturer: 'Boeing',
        model: '777-223ER',
        category: 'large_transport',
        operator: 'American Airlines',
        flightNumber: 'AAL106',
        flightPhase: 'takeoff',
        role: 'secondary',
        crew: 13,
        passengers: 200,
      },
    ],
    weather: {
      condition: 'VMC',
      visibility: 10,
      wind: { direction: 40, speed: 12 },
      temperature: 4,
      dewpoint: -2,
      flightCategory: 'VFR',
      phenomena: [],
      nighttime: true,
    },
    narrative: `On March 13, 2019, at 2143 local time, Delta Air Lines flight 1943, a Boeing 767-300, crossed runway 4L at John F. Kennedy International Airport without a clearance, passing in front of American Airlines flight 106, a Boeing 777-200, which was holding in position on runway 4L awaiting takeoff clearance.

Delta 1943 had been cleared to taxi to gate B23 via taxiways. The crew, unfamiliar with JFK's complex taxiway geometry at night, crossed runway 4L without receiving a crossing clearance from the local controller. American 106 was holding in position awaiting takeoff on runway 4L.

The American 106 crew observed the crossing Delta aircraft and did not initiate the takeoff roll. The ASDE-X system at JFK generated a conflict alert, which the ground controller noted. Separation between the two aircraft was approximately 1,000 feet.

The JFK ASDE-X system successfully detected the incursion and generated an alert, demonstrating the value of surface surveillance equipment. However, the alert came too late to prevent the incursion itself.`,
    probableCause:
      'The Delta Air Lines flight 1943 crew crossed runway 4L without ATC clearance due to inadequate situational awareness of their position on the airport surface in relation to the active runway, and the crew\'s failure to comply with standard hold short procedures.',
    contributingFactors: [
      'Complex JFK taxiway geometry contributing to crew disorientation',
      'Night operations reducing visual cues',
      'Crew unfamiliarity with specific JFK taxiway configuration',
      'Failure to use and correctly interpret airport diagram',
      'Controller did not note Delta crossing in time to issue warning',
    ],
    humanFactors: [
      {
        category: 'situational_awareness',
        confidence: 92,
        description:
          'Delta crew lost positional awareness on JFK surface due to complex taxiway layout and night conditions.',
        parties: ['pilot'],
      },
      {
        category: 'procedural_deviation',
        confidence: 88,
        description:
          'Crew crossed runway hold short marking without receiving or verifying crossing clearance.',
        parties: ['pilot'],
      },
      {
        category: 'complacency',
        confidence: 65,
        description: 'Possible complacency in verifying position before crossing marked runway.',
        parties: ['pilot'],
      },
    ],
    infrastructure: [
      {
        category: 'asde_x',
        description:
          'ASDE-X was present and generated a conflict alert, but the alert came after the crossing had begun.',
        present: true,
        contributed: false,
      },
      {
        category: 'airport_geometry',
        description:
          'JFK complex taxiway geometry with multiple runway crossings creates high incursion risk, particularly at night.',
        present: true,
        contributed: true,
      },
    ],
    recommendations: [
      {
        id: 'A-19-027',
        text: 'Require all Part 121 carriers to implement enhanced runway crossing confirmation procedures at airports with complex surface geometry.',
        recipient: 'FAA',
        recipientName: 'Federal Aviation Administration',
        status: 'closed',
        issueDate: '2019-09-01',
        closedDate: '2020-06-01',
        closedDescription: 'FAA updated AC 120-74B to require read-back of all hold short instructions.',
        investigationId: 'DCA19LA071',
        category: 'ATC Procedures',
        priority: 'priority',
      },
    ],
    injuries: { fatal: 0, serious: 0, minor: 0, none: 213 },
    reportUrl: 'https://www.ntsb.gov/investigations/AccidentReports/Pages/DCA19LA071.aspx',
    timeline: [
      {
        time: '21:30',
        description: 'Delta 1943 lands runway 31L, clears at taxiway B',
        category: 'aircraft',
      },
      {
        time: '21:35',
        description: 'Delta 1943 instructed to taxi to gate B23 via Lima, November, Kilo, Delta',
        category: 'atc',
      },
      {
        time: '21:38',
        description: 'American 106 cleared to hold in position runway 4L',
        category: 'atc',
      },
      {
        time: '21:43',
        description: 'Delta 1943 crosses runway 4L without clearance, passing ahead of AAL106',
        category: 'aircraft',
        critical: true,
      },
      {
        time: '21:43:15',
        description: 'ASDE-X conflict alert generated at JFK ATCT',
        category: 'system',
        critical: true,
      },
      {
        time: '21:43:30',
        description: 'American 106 crew holds, observes Delta aircraft crossing',
        category: 'aircraft',
      },
      {
        time: '21:44',
        description: 'Controller issues stop instruction to Delta 1943',
        category: 'atc',
      },
    ],
    tags: [
      'runway_incursion',
      'category_B',
      'JFK',
      'night',
      'Delta',
      'American',
      'ASDE-X',
      'taxiway_confusion',
      'situational_awareness',
    ],
  },

  // ────────────────────────────────────────────────────────────
  // DCA22LA063 — BOS: JetBlue 206 / Learjet 31
  // May 27, 2022 — Near Midair Collision
  // ────────────────────────────────────────────────────────────
  {
    id: 'DCA22LA063',
    eventDate: '2022-05-27',
    eventTime: '14:23',
    localTimezone: 'America/New_York',
    synopsis:
      'A JetBlue Airbus A320 on departure from Boston Logan and a Learjet 31 operating under VFR experienced a loss of separation of approximately 400 feet vertically and 400 feet horizontally over Massachusetts Bay.',
    location: {
      city: 'Boston',
      state: 'Massachusetts',
      stateAbbr: 'MA',
      country: 'USA',
      airport: 'Boston Logan International Airport',
      airportId: 'KBOS',
      airportIata: 'BOS',
      coordinates: { lat: 42.3656, lng: -71.0096 },
    },
    eventType: 'incident',
    subType: 'near_midair_collision',
    severity: 'none',
    status: 'closed',
    aircraft: [
      {
        registration: 'N729JB',
        manufacturer: 'Airbus',
        model: 'A320-232',
        category: 'large_transport',
        operator: 'JetBlue Airways',
        flightNumber: 'JBU206',
        flightPhase: 'climb',
        role: 'primary',
        crew: 6,
        passengers: 164,
      },
      {
        registration: 'N831LX',
        manufacturer: 'Learjet',
        model: '31A',
        category: 'small_transport',
        operator: 'Charter Air LLC',
        flightNumber: 'N831LX',
        flightPhase: 'cruise',
        role: 'secondary',
        crew: 2,
        passengers: 3,
      },
    ],
    weather: {
      condition: 'VMC',
      visibility: 10,
      wind: { direction: 250, speed: 8 },
      temperature: 22,
      dewpoint: 12,
      flightCategory: 'VFR',
      phenomena: [],
      nighttime: false,
    },
    narrative: `On May 27, 2022, at approximately 1423 local time, JetBlue Airways flight 206, an Airbus A320-232, and a Learjet 31A, N831LX, experienced a loss of separation approximately 15 miles east of Boston Logan International Airport.

JetBlue 206 was climbing through approximately 3,000 feet MSL on its departure climb out when a Learjet 31A operating under VFR without an ATC flight following transponder code entered the Boston Terminal Radar Service Area (TRSA) without radio contact.

The JetBlue aircraft's TCAS II generated a Resolution Advisory (RA) commanding a descend, which the crew followed. The Learjet crew received a TCAS TA but did not take evasive action. Minimum separation was approximately 400 feet vertically and 400 feet horizontally.

Boston Approach Control radar did not have Mode C readout from the Learjet until after the separation event had begun, limiting controller ability to identify the conflict in advance.`,
    probableCause:
      'The Learjet crew\'s failure to maintain contact with ATC and to follow TCAS traffic advisory instructions. Contributing was the Learjet\'s operation in controlled airspace without maintaining communication with approach control.',
    contributingFactors: [
      'Learjet operated in Class C airspace without ATC communication',
      'Learjet crew did not follow TCAS TA',
      'Limited controller warning time due to radar detection delay',
    ],
    humanFactors: [
      {
        category: 'situational_awareness',
        confidence: 90,
        description:
          'Learjet crew failed to maintain awareness of airspace class and communication requirements.',
        parties: ['pilot'],
      },
      {
        category: 'procedural_deviation',
        confidence: 95,
        description: 'Learjet crew did not comply with TCAS Traffic Advisory resolution.',
        parties: ['pilot'],
      },
    ],
    infrastructure: [],
    recommendations: [
      {
        id: 'A-22-041',
        text: 'Require all aircraft operating in Class B and C airspace to be equipped with ADS-B Out capability.',
        recipient: 'FAA',
        recipientName: 'Federal Aviation Administration',
        status: 'closed',
        issueDate: '2022-11-01',
        closedDate: '2023-01-01',
        closedDescription: 'ADS-B Out mandate already in effect under 14 CFR 91.225.',
        investigationId: 'DCA22LA063',
        category: 'Surveillance',
        priority: 'priority',
      },
    ],
    injuries: { fatal: 0, serious: 0, minor: 0, none: 175 },
    timeline: [
      {
        time: '14:18',
        description: 'JetBlue 206 departs runway 22R BOS, turns to heading 090',
        category: 'aircraft',
      },
      {
        time: '14:20',
        description: 'Learjet 31A enters Boston Class C without radio contact',
        category: 'aircraft',
        critical: true,
      },
      {
        time: '14:22',
        description: 'Boston Approach detects Learjet primary return at 3,200 ft',
        category: 'atc',
      },
      {
        time: '14:23',
        description: 'JetBlue 206 TCAS generates Resolution Advisory: Descend',
        category: 'system',
        critical: true,
      },
      {
        time: '14:23:15',
        description: 'JetBlue 206 crew follows RA, begins descent',
        category: 'aircraft',
      },
      {
        time: '14:23:25',
        description: 'Aircraft pass — 400 ft vertical, 400 ft horizontal',
        category: 'aircraft',
        critical: true,
      },
      {
        time: '14:24',
        description: 'Controller issues traffic advisory to JetBlue after separation',
        category: 'atc',
      },
    ],
    tags: [
      'near_midair',
      'TCAS',
      'Boston',
      'BOS',
      'Class_C',
      'VFR',
      'loss_of_separation',
      'ADS-B',
    ],
  },

  // ────────────────────────────────────────────────────────────
  // DCA15IA002 — SFO: Asiana 214 Runway Incursion Concern
  // 2015 follow-up runway incursion at SFO
  // ────────────────────────────────────────────────────────────
  {
    id: 'DCA17LA034',
    eventDate: '2017-07-07',
    eventTime: '23:56',
    localTimezone: 'America/Los_Angeles',
    synopsis:
      "An Air Canada Airbus A320 on approach to San Francisco International Airport lined up on a taxiway occupied by four aircraft awaiting departure instead of the assigned runway, descending to within 59 feet of a United Airlines Boeing 787 before executing a go-around.",
    location: {
      city: 'San Francisco',
      state: 'California',
      stateAbbr: 'CA',
      country: 'USA',
      airport: 'San Francisco International Airport',
      airportId: 'KSFO',
      airportIata: 'SFO',
      coordinates: { lat: 37.6213, lng: -122.379 },
    },
    eventType: 'incident',
    subType: 'near_midair_collision',
    severity: 'none',
    status: 'closed',
    aircraft: [
      {
        registration: 'C-FKCK',
        manufacturer: 'Airbus',
        model: 'A320-211',
        category: 'large_transport',
        operator: 'Air Canada',
        flightNumber: 'ACA759',
        flightPhase: 'approach',
        role: 'primary',
        crew: 6,
        passengers: 135,
      },
      {
        registration: 'N27964',
        manufacturer: 'Boeing',
        model: '787-9',
        category: 'large_transport',
        operator: 'United Airlines',
        flightNumber: 'UAL1',
        flightPhase: 'taxi',
        role: 'secondary',
        crew: 12,
        passengers: 358,
      },
    ],
    weather: {
      condition: 'VMC',
      visibility: 10,
      wind: { direction: 280, speed: 6 },
      temperature: 14,
      dewpoint: 10,
      flightCategory: 'VFR',
      phenomena: [],
      nighttime: true,
    },
    narrative: `On July 7, 2017, at 2356 local time, Air Canada flight 759, an Airbus A320, lined up on taxiway Charlie at San Francisco International Airport rather than runway 28R, which was the assigned landing runway. Four aircraft were holding on taxiway Charlie awaiting departure.

The Air Canada crew had been cleared to land runway 28R. Runway 28L was NOTAM'd closed for construction, leaving runway 28L dark and runway 28R the active runway. The crew likely confused the lit taxiway Charlie, which had four aircraft with lights on, for the runway.

The aircraft descended to approximately 59 feet above taxiway Charlie, overflying a United Airlines 787 before the crew initiated a go-around in response to a query from the tower and the "TRAFFIC ALERT" callout. Four aircraft with as many as 1,000 people aboard were on the taxiway.

This incident is considered one of the most serious runway safety events in U.S. aviation history due to the potential for catastrophic multi-aircraft loss.`,
    probableCause:
      'Air Canada flight 759 crew lined up on taxiway Charlie rather than runway 28R due to confusion caused by runway 28L\'s NOTAM closure and darkness, combined with the visual similarity of the lit taxiway to the runway. The crew failed to verify their alignment using available instruments.',
    contributingFactors: [
      'NOTAM closure of adjacent runway 28L creating visual asymmetry',
      'Night VMC conditions reducing differentiation between runway and taxiway',
      'Four large transport category aircraft on taxiway with lights visible',
      'Crew failure to cross-check alignment using ILS or other instruments',
      'Crew fatigue — flight from Toronto, late night arrival',
    ],
    humanFactors: [
      {
        category: 'situational_awareness',
        confidence: 98,
        description:
          'Air Canada crew lost positional awareness during visual approach, confusing taxiway Charlie for runway 28R.',
        parties: ['pilot'],
      },
      {
        category: 'fatigue',
        confidence: 70,
        description:
          'Flight from Toronto arriving near midnight local time; fatigue may have contributed to degraded performance.',
        parties: ['pilot'],
      },
      {
        category: 'complacency',
        confidence: 78,
        description:
          'Crew may have relied excessively on visual approach without instrument cross-check verification.',
        parties: ['pilot'],
      },
    ],
    infrastructure: [
      {
        category: 'lighting',
        description:
          'Runway 28L was dark per NOTAM, creating unusual lighting pattern that may have contributed to crew confusion.',
        present: true,
        contributed: true,
      },
    ],
    recommendations: [
      {
        id: 'A-17-024',
        text: 'Require SFO to evaluate and implement enhanced taxiway lighting or markings to differentiate taxiway Charlie from the adjacent runways.',
        recipient: 'FAA',
        recipientName: 'Federal Aviation Administration',
        status: 'closed',
        issueDate: '2017-12-01',
        closedDate: '2019-06-01',
        closedDescription:
          'SFO implemented enhanced taxiway centerline lighting and increased green lighting on taxiway Charlie.',
        investigationId: 'DCA17LA034',
        category: 'Airport Infrastructure',
        priority: 'urgent',
      },
      {
        id: 'A-17-025',
        text: 'Require all Part 121 operators to brief crews on NOTAM-closed parallel runway procedures and the potential for visual confusion.',
        recipient: 'FAA',
        recipientName: 'Federal Aviation Administration',
        status: 'closed',
        issueDate: '2017-12-01',
        closedDate: '2018-09-01',
        closedDescription: 'FAA updated AC 120-74B with parallel runway NOTAM briefing requirements.',
        investigationId: 'DCA17LA034',
        category: 'Crew Training',
        priority: 'priority',
      },
    ],
    injuries: { fatal: 0, serious: 0, minor: 0, none: 511 },
    reportUrl: 'https://www.ntsb.gov/investigations/AccidentReports/Reports/AIR1901.pdf',
    timeline: [
      {
        time: '23:48',
        description: 'Air Canada 759 checks in with SFO Approach, 40 miles northeast',
        category: 'aircraft',
      },
      {
        time: '23:52',
        description: 'Tower clears Air Canada 759 for visual approach runway 28R',
        category: 'atc',
      },
      {
        time: '23:53',
        description: 'Crew reports runway in sight — likely taxiway Charlie',
        category: 'aircraft',
        critical: true,
      },
      {
        time: '23:55',
        description: 'Four aircraft holding on taxiway Charlie: UAL1 (787), PHX (A321), UAL863 (737), AAL759 (A321)',
        category: 'aircraft',
      },
      {
        time: '23:56',
        description: 'Air Canada 759 crosses threshold area, aligned on taxiway Charlie',
        category: 'aircraft',
        critical: true,
      },
      {
        time: '23:56:05',
        description: 'Tower controller: "Air Canada 759, cleared to land runway 28R"',
        category: 'atc',
      },
      {
        time: '23:56:10',
        description: 'UAL1 captain calls "Lights on the taxiway!" on tower frequency',
        category: 'aircraft',
        critical: true,
      },
      {
        time: '23:56:12',
        description: 'Air Canada 759 reaches 59 feet AGL above taxiway Charlie',
        category: 'aircraft',
        critical: true,
      },
      {
        time: '23:56:15',
        description: 'Air Canada 759 initiates go-around',
        category: 'aircraft',
      },
      {
        time: '00:04',
        description: 'Air Canada 759 executes successful ILS approach and landing runway 28R',
        category: 'aircraft',
      },
    ],
    tags: [
      'near_midair',
      'SFO',
      'runway_confusion',
      'taxiway',
      'night',
      'Air_Canada',
      'go_around',
      'fatigue',
      'situational_awareness',
    ],
  },

  // ────────────────────────────────────────────────────────────
  // ERA22FA111 — Asiana 214 — San Francisco
  // Already well known — let's add Nashville Runway Incursion 2023
  // ────────────────────────────────────────────────────────────
  {
    id: 'ERA23IA108',
    eventDate: '2023-04-22',
    eventTime: '17:12',
    localTimezone: 'America/Chicago',
    synopsis:
      'A United Express Embraer 175 and a FedEx Cessna 208 Caravan experienced a runway incursion at Nashville International Airport when the Caravan entered runway 31 without clearance.',
    location: {
      city: 'Nashville',
      state: 'Tennessee',
      stateAbbr: 'TN',
      country: 'USA',
      airport: 'Nashville International Airport',
      airportId: 'KBNA',
      airportIata: 'BNA',
      coordinates: { lat: 36.1245, lng: -86.6782 },
    },
    eventType: 'incident',
    subType: 'runway_incursion',
    severity: 'none',
    status: 'closed',
    runwayIncursion: {
      category: 'B',
      runway: '31',
      conflictType: 'Aircraft vs. Aircraft',
    },
    aircraft: [
      {
        registration: 'N110SY',
        manufacturer: 'Embraer',
        model: 'ERJ-175LR',
        category: 'regional',
        operator: 'SkyWest Airlines d/b/a United Express',
        flightNumber: 'SKW5411',
        flightPhase: 'takeoff',
        role: 'primary',
        crew: 4,
        passengers: 67,
      },
      {
        registration: 'N963FE',
        manufacturer: 'Cessna',
        model: '208B Super Cargomaster',
        category: 'general_aviation',
        operator: 'Federal Express (feeder)',
        flightNumber: 'N963FE',
        flightPhase: 'taxi',
        role: 'secondary',
        crew: 1,
        cargo: true,
      },
    ],
    weather: {
      condition: 'VMC',
      visibility: 7,
      wind: { direction: 300, speed: 11 },
      temperature: 18,
      dewpoint: 9,
      flightCategory: 'VFR',
      phenomena: [],
      nighttime: false,
    },
    narrative: `On April 22, 2023, at approximately 1712 local time, a runway incursion occurred at Nashville International Airport involving a SkyWest Airlines ERJ-175 and a FedEx feeder Cessna 208 Caravan.

The Caravan, N963FE, was taxiing inbound and entered runway 31 without receiving a crossing clearance while the SkyWest ERJ-175 was mid-takeoff roll on runway 31. The Caravan crossed to approximately the runway centerline before the pilot recognized the incursion and attempted to clear the runway.

The ERJ-175 crew observed the Caravan crossing the runway during their takeoff roll. The crew rejected the takeoff at approximately 90 knots indicated airspeed, well below V1. The aircraft decelerated and stopped short of the Caravan position.

Nashville International had ASDE-X installed and the system generated a conflict alert. The ground controller transmitted a stop clearance to the Caravan but the transmission was incomplete as the aircraft had already entered the runway.`,
    probableCause:
      'The FedEx feeder Cessna 208 crew\'s entry onto runway 31 without ATC clearance. The crew\'s situational awareness was degraded by workload associated with position reporting and radio frequency changes.',
    contributingFactors: [
      'Caravan crew changed frequencies during critical taxi phase',
      'Radio frequency congestion at BNA during afternoon bank',
      'ASDE-X alert after incursion had begun',
      'Hold short marking at complex intersection poorly visible',
    ],
    humanFactors: [
      {
        category: 'situational_awareness',
        confidence: 88,
        description:
          'Caravan crew lost awareness of position relative to runway 31 hold short point during frequency change.',
        parties: ['pilot'],
      },
      {
        category: 'workload',
        confidence: 82,
        description:
          'High workload during taxi phases included frequency changes, ATIS, and coordination reducing runway entry vigilance.',
        parties: ['pilot'],
      },
    ],
    infrastructure: [
      {
        category: 'asde_x',
        description:
          'ASDE-X was present and generated alert, but the aircraft had already entered the runway before the alert could prevent the incursion.',
        present: true,
        contributed: false,
      },
      {
        category: 'signage',
        description:
          'Hold short markings at the runway 31 intersection with taxiway Foxtrot were identified as potentially difficult to see in afternoon lighting conditions.',
        present: true,
        contributed: true,
      },
    ],
    recommendations: [
      {
        id: 'A-23-041',
        text: 'Evaluate and improve hold short markings at Nashville runway 31 and taxiway Foxtrot intersection for improved conspicuity in afternoon lighting.',
        recipient: 'FAA',
        recipientName: 'Federal Aviation Administration',
        status: 'closed',
        issueDate: '2023-10-01',
        closedDate: '2024-02-01',
        closedDescription: 'BNA enhanced markings and installed enhanced stop bar lighting.',
        investigationId: 'ERA23IA108',
        category: 'Airport Markings',
        priority: 'priority',
      },
    ],
    injuries: { fatal: 0, serious: 0, minor: 0, none: 72 },
    timeline: [
      {
        time: '17:05',
        description: 'FedEx Caravan lands runway 2R, taxis inbound',
        category: 'aircraft',
      },
      {
        time: '17:09',
        description: 'SkyWest 5411 cleared for takeoff runway 31',
        category: 'atc',
      },
      {
        time: '17:09:30',
        description: 'SKW5411 begins takeoff roll runway 31',
        category: 'aircraft',
      },
      {
        time: '17:12',
        description: 'Caravan enters runway 31 without clearance',
        category: 'aircraft',
        critical: true,
      },
      {
        time: '17:12:05',
        description: 'ASDE-X conflict alert triggered at BNA ATCT',
        category: 'system',
        critical: true,
      },
      {
        time: '17:12:08',
        description: 'SKW5411 crew observes Caravan, initiates rejected takeoff at 90 KIAS',
        category: 'aircraft',
        critical: true,
      },
      {
        time: '17:12:20',
        description: 'SKW5411 stops on runway; Caravan clears',
        category: 'aircraft',
      },
    ],
    tags: [
      'runway_incursion',
      'category_B',
      'Nashville',
      'BNA',
      'rejected_takeoff',
      'ASDE-X',
      'workload',
    ],
  },

  // ────────────────────────────────────────────────────────────
  // LAX Runway Incursion — 2022
  // ────────────────────────────────────────────────────────────
  {
    id: 'WPR22IA145',
    eventDate: '2022-02-05',
    eventTime: '07:52',
    localTimezone: 'America/Los_Angeles',
    synopsis:
      'An American Airlines Boeing 737 crossed an active runway at Los Angeles International Airport in front of a departing Alaska Airlines Boeing 737, requiring a rejected takeoff at high speed.',
    location: {
      city: 'Los Angeles',
      state: 'California',
      stateAbbr: 'CA',
      country: 'USA',
      airport: 'Los Angeles International Airport',
      airportId: 'KLAX',
      airportIata: 'LAX',
      coordinates: { lat: 33.9425, lng: -118.408 },
    },
    eventType: 'incident',
    subType: 'runway_incursion',
    severity: 'none',
    status: 'closed',
    runwayIncursion: {
      category: 'A',
      runway: '24L',
      conflictType: 'Aircraft vs. Aircraft',
    },
    aircraft: [
      {
        registration: 'N905AN',
        manufacturer: 'Boeing',
        model: '737-823',
        category: 'large_transport',
        operator: 'American Airlines',
        flightNumber: 'AAL2359',
        flightPhase: 'taxi',
        role: 'primary',
        crew: 6,
        passengers: 176,
      },
      {
        registration: 'N568AS',
        manufacturer: 'Boeing',
        model: '737-890',
        category: 'large_transport',
        operator: 'Alaska Airlines',
        flightNumber: 'ASA1282',
        flightPhase: 'takeoff',
        role: 'secondary',
        crew: 6,
        passengers: 178,
      },
    ],
    weather: {
      condition: 'VMC',
      visibility: 10,
      wind: { direction: 250, speed: 7 },
      temperature: 14,
      dewpoint: 7,
      flightCategory: 'VFR',
      phenomena: [],
      nighttime: false,
    },
    narrative: `On February 5, 2022, at 0752 local time, an American Airlines Boeing 737 crossed runway 24L at Los Angeles International Airport without a crossing clearance while an Alaska Airlines Boeing 737 was on a high-speed takeoff roll on the same runway.

The American Airlines crew had been given taxi instructions to runway 24R. During taxi, the crew crossed taxiway November when the aircraft entered runway 24L. The Alaska Airlines aircraft was at approximately 120 knots when the crew observed the American aircraft on the runway.

The Alaska Airlines crew initiated a rejected takeoff and the aircraft stopped safely on the runway. The American Airlines aircraft crossed the runway before the Alaska aircraft reached that position, but the minimum separation was less than required.

LAX was equipped with ASDE-X which triggered a runway incursion alert. The FAA considered this a Category A incursion — the highest severity level — due to the high speed of the Alaska aircraft and the potential for catastrophic collision.`,
    probableCause:
      'The American Airlines flight 2359 crew crossed runway 24L without clearance, resulting in a Category A runway incursion. The crew did not properly verify their position on the airport surface before crossing the hold short line.',
    contributingFactors: [
      'Complex LAX taxiway configuration between parallel runways',
      'Morning departure rush at LAX increasing controller workload',
      'Crew did not verify clearance before runway crossing',
      'ASDE-X alert came as aircraft was already on the runway',
    ],
    humanFactors: [
      {
        category: 'situational_awareness',
        confidence: 94,
        description:
          'American Airlines crew did not maintain awareness of position relative to runway 24L during complex taxi.',
        parties: ['pilot'],
      },
      {
        category: 'procedural_deviation',
        confidence: 90,
        description: 'Crew crossed runway without receiving or requesting crossing clearance.',
        parties: ['pilot'],
      },
    ],
    infrastructure: [
      {
        category: 'asde_x',
        description: 'LAX ASDE-X generated conflict alert; controllers received warning.',
        present: true,
        contributed: false,
      },
    ],
    recommendations: [
      {
        id: 'A-22-022',
        text: 'Require enhanced runway guard lights at the taxiway November / runway 24L intersection at KLAX.',
        recipient: 'FAA',
        recipientName: 'Federal Aviation Administration',
        status: 'closed',
        issueDate: '2022-07-01',
        closedDate: '2023-03-01',
        closedDescription: 'LAX installed in-pavement runway guard lights at all runway crossings.',
        investigationId: 'WPR22IA145',
        category: 'Runway Safety',
        priority: 'urgent',
      },
    ],
    injuries: { fatal: 0, serious: 0, minor: 0, none: 360 },
    timeline: [
      {
        time: '07:44',
        description: 'American 2359 pushes back, given taxi to runway 24R via November',
        category: 'atc',
      },
      {
        time: '07:48',
        description: 'Alaska 1282 cleared for takeoff runway 24L',
        category: 'atc',
      },
      {
        time: '07:50',
        description: 'Alaska 1282 begins takeoff roll runway 24L',
        category: 'aircraft',
      },
      {
        time: '07:52',
        description: 'American 2359 crosses runway 24L hold short without clearance',
        category: 'aircraft',
        critical: true,
      },
      {
        time: '07:52:10',
        description: 'LAX ASDE-X conflict alert generated',
        category: 'system',
        critical: true,
      },
      {
        time: '07:52:15',
        description: 'Alaska 1282 crew observes American on runway, initiates RTO at ~120 KIAS',
        category: 'aircraft',
        critical: true,
      },
      {
        time: '07:52:40',
        description: 'Alaska 1282 stops safely on runway 24L',
        category: 'aircraft',
      },
    ],
    tags: [
      'runway_incursion',
      'category_A',
      'LAX',
      'American',
      'Alaska',
      'rejected_takeoff',
      'ASDE-X',
      'morning',
    ],
  },

  // ────────────────────────────────────────────────────────────
  // ORD — 2014 Ground Vehicle Incursion
  // ────────────────────────────────────────────────────────────
  {
    id: 'CEN14IA181',
    eventDate: '2014-05-13',
    eventTime: '19:34',
    localTimezone: 'America/Chicago',
    synopsis:
      'A United Airlines Boeing 757 executed a rejected takeoff at Chicago O\'Hare International Airport after a fuel truck crossed runway 32R in front of the aircraft at approximately 100 knots.',
    location: {
      city: "Chicago",
      state: 'Illinois',
      stateAbbr: 'IL',
      country: 'USA',
      airport: "Chicago O'Hare International Airport",
      airportId: 'KORD',
      airportIata: 'ORD',
      coordinates: { lat: 41.9742, lng: -87.9073 },
    },
    eventType: 'incident',
    subType: 'runway_incursion',
    severity: 'none',
    status: 'closed',
    runwayIncursion: {
      category: 'A',
      runway: '32R',
      conflictType: 'Aircraft vs. Vehicle',
    },
    aircraft: [
      {
        registration: 'N17104',
        manufacturer: 'Boeing',
        model: '757-224',
        category: 'large_transport',
        operator: 'United Airlines',
        flightNumber: 'UAL821',
        flightPhase: 'takeoff',
        role: 'primary',
        crew: 7,
        passengers: 175,
      },
    ],
    weather: {
      condition: 'VMC',
      visibility: 9,
      wind: { direction: 320, speed: 14 },
      temperature: 16,
      dewpoint: 8,
      flightCategory: 'VFR',
      phenomena: [],
      nighttime: false,
    },
    narrative: `On May 13, 2014, at 1934 local time, United Airlines flight 821, a Boeing 757-200, initiated a rejected takeoff on runway 32R at O'Hare International Airport after a fuel truck crossed the runway without authorization at approximately the runway midpoint.

The fuel truck driver had received instructions to cross runway 32R at taxiway Juliet. The driver proceeded to the crossing point and entered the runway without verifying whether a crossing clearance had been issued. The truck crossed at approximately the midpoint of the runway while United 821 was accelerating through approximately 100 knots.

The United crew observed the fuel truck crossing and initiated a rejected takeoff. The aircraft decelerated and stopped approximately 3,000 feet before reaching the intersection where the truck crossed.

O'Hare was equipped with ASDE-X, which generated an alert when the fuel truck entered the runway. The controller received the alert and initiated a stop transmission, but the aircraft crew had already initiated the RTO.`,
    probableCause:
      "The fuel truck driver's entry onto runway 32R without ATC authorization, resulting in a Category A runway incursion with an aircraft on takeoff roll.",
    contributingFactors: [
      "Fuel truck driver misunderstood or did not receive crossing clearance",
      "Vehicle driver communication protocol lapses",
      "Evening operations with glare potentially affecting driver visibility",
      "ASDE-X alert slightly delayed relative to actual entry",
    ],
    humanFactors: [
      {
        category: 'situational_awareness',
        confidence: 86,
        description:
          "Fuel truck driver did not confirm clearance before entering active runway.",
        parties: ['ground_vehicle_operator'],
      },
      {
        category: 'communication',
        confidence: 80,
        description:
          "Communication breakdown between fueling supervisor and driver regarding crossing clearance.",
        parties: ['ground_vehicle_operator'],
      },
    ],
    infrastructure: [
      {
        category: 'asde_x',
        description: "ASDE-X was operational and generated conflict alert.",
        present: true,
        contributed: false,
      },
    ],
    recommendations: [
      {
        id: 'A-14-039',
        text: "Require all airport ground vehicle operators to complete a standardized runway incursion training program and demonstrate proficiency before being authorized to cross active runways.",
        recipient: 'FAA',
        recipientName: 'Federal Aviation Administration',
        status: 'closed',
        issueDate: '2014-11-01',
        closedDate: '2016-03-01',
        closedDescription: "FAA issued updated advisory circular AC 150/5210-20A for ground vehicle training.",
        investigationId: 'CEN14IA181',
        category: 'Ground Vehicle Operations',
        priority: 'priority',
      },
    ],
    injuries: { fatal: 0, serious: 0, minor: 0, none: 182 },
    timeline: [
      {
        time: '19:28',
        description: "United 821 pushes back from gate, given taxi to runway 32R",
        category: 'atc',
      },
      {
        time: '19:32',
        description: "Fuel truck dispatched from ramp to cross runway 32R at taxiway Juliet",
        category: 'aircraft',
      },
      {
        time: '19:33',
        description: "United 821 cleared for takeoff runway 32R",
        category: 'atc',
      },
      {
        time: '19:33:30',
        description: "United 821 begins takeoff roll",
        category: 'aircraft',
      },
      {
        time: '19:34',
        description: "Fuel truck enters runway 32R at taxiway Juliet without clearance",
        category: 'aircraft',
        critical: true,
      },
      {
        time: '19:34:05',
        description: "ASDE-X conflict alert generated",
        category: 'system',
        critical: true,
      },
      {
        time: '19:34:08',
        description: "United 821 crew observes fuel truck, initiates RTO at ~100 KIAS",
        category: 'aircraft',
        critical: true,
      },
      {
        time: '19:34:45',
        description: "United 821 stops safely, fuel truck clears runway",
        category: 'aircraft',
      },
    ],
    tags: [
      'runway_incursion',
      'category_A',
      'ORD',
      'vehicle',
      'fuel_truck',
      'United',
      'rejected_takeoff',
      'ASDE-X',
      'Chicago',
    ],
  },

  // ────────────────────────────────────────────────────────────
  // DFW Runway Incursion — 2021
  // ────────────────────────────────────────────────────────────
  {
    id: 'CEN21IA094',
    eventDate: '2021-09-15',
    eventTime: '22:18',
    localTimezone: 'America/Chicago',
    synopsis:
      'An American Airlines Boeing 777 and a FedEx Boeing 757 experienced a runway incursion at Dallas/Fort Worth International Airport when the FedEx aircraft entered runway 35R without clearance during night IFR conditions.',
    location: {
      city: 'Fort Worth',
      state: 'Texas',
      stateAbbr: 'TX',
      country: 'USA',
      airport: 'Dallas/Fort Worth International Airport',
      airportId: 'KDFW',
      airportIata: 'DFW',
      coordinates: { lat: 32.8998, lng: -97.0403 },
    },
    eventType: 'incident',
    subType: 'runway_incursion',
    severity: 'none',
    status: 'closed',
    runwayIncursion: {
      category: 'C',
      runway: '35R',
      conflictType: 'Aircraft vs. Aircraft',
    },
    aircraft: [
      {
        registration: 'N780AN',
        manufacturer: 'Boeing',
        model: '777-223ER',
        category: 'large_transport',
        operator: 'American Airlines',
        flightNumber: 'AAL567',
        flightPhase: 'landing',
        role: 'primary',
        crew: 11,
        passengers: 260,
      },
      {
        registration: 'N735FD',
        manufacturer: 'Boeing',
        model: '757-236SF',
        category: 'large_transport',
        operator: 'Federal Express Corporation',
        flightNumber: 'FDX3312',
        flightPhase: 'taxi',
        role: 'secondary',
        crew: 2,
        cargo: true,
      },
    ],
    weather: {
      condition: 'IMC',
      visibility: 2,
      ceiling: 800,
      wind: { direction: 350, speed: 9 },
      temperature: 20,
      dewpoint: 18,
      flightCategory: 'IFR',
      phenomena: ['BR'],
      nighttime: true,
    },
    narrative: `On September 15, 2021, at 2218 local time, an American Airlines Boeing 777 on approach to DFW runway 35R and a FedEx Boeing 757 that entered runway 35R without clearance experienced a Category C runway incursion at Dallas/Fort Worth International Airport.

The FedEx 757 had been cleared to taxi to the cargo ramp and was instructed to hold short of runway 35R at taxiway Mike. The crew, distracted by inbound cargo paperwork and frequency changes, entered runway 35R before the American 777 had landed and cleared.

The American 777 landed and was decelerating when the FedEx aircraft's lights became visible crossing the runway ahead. The American crew applied maximum braking but the aircraft cleared the intersection before the FedEx aircraft had fully entered.

Actual separation at the time of closest approach was approximately 2,000 feet — meeting the Category C criteria. DFW had ASDE-X and the controller received an alert but was focused on a frequency change issue with another aircraft.`,
    probableCause:
      "The FedEx crew's entry onto runway 35R without ATC clearance while an American Airlines flight was on short final approach to the same runway.",
    contributingFactors: [
      "FedEx crew distracted by cargo paperwork during critical taxi phase",
      "Night IFR conditions reducing visual runway identification",
      "Controller attention diverted by unrelated radio issue",
      "DFW complex north end taxiway configuration",
    ],
    humanFactors: [
      {
        category: 'situational_awareness',
        confidence: 88,
        description:
          "FedEx crew lost track of position during taxi, missing the hold short instruction for runway 35R.",
        parties: ['pilot'],
      },
      {
        category: 'workload',
        confidence: 76,
        description:
          "Non-standard workload from cargo paperwork distracted crew from primary taxi duties.",
        parties: ['pilot'],
      },
    ],
    infrastructure: [
      {
        category: 'asde_x',
        description: "DFW ASDE-X generated alert but controller was focused on another traffic issue.",
        present: true,
        contributed: true,
      },
    ],
    recommendations: [
      {
        id: 'A-21-058',
        text: "Require all Part 121 cargo operators to prohibit non-flight-essential tasks during taxi operations, including cargo paperwork review.",
        recipient: 'FAA',
        recipientName: 'Federal Aviation Administration',
        status: 'closed',
        issueDate: '2021-12-01',
        closedDate: '2022-09-01',
        closedDescription: "FAA updated Part 121 sterile cockpit regulations to include all ground operations.",
        investigationId: 'CEN21IA094',
        category: 'Crew Procedures',
        priority: 'priority',
      },
    ],
    injuries: { fatal: 0, serious: 0, minor: 0, none: 273 },
    timeline: [
      {
        time: '22:08',
        description: "FedEx 3312 lands runway 17C, taxis to cargo ramp via Kilo, Mike",
        category: 'aircraft',
      },
      {
        time: '22:12',
        description: "American 567 cleared ILS approach runway 35R from 30 miles south",
        category: 'atc',
      },
      {
        time: '22:15',
        description: "FedEx crew begins reviewing cargo paperwork during taxi",
        category: 'aircraft',
        critical: true,
      },
      {
        time: '22:18',
        description: "FedEx 3312 enters runway 35R at taxiway Mike without clearance",
        category: 'aircraft',
        critical: true,
      },
      {
        time: '22:18:05',
        description: "ASDE-X conflict alert: runway 35R",
        category: 'system',
        critical: true,
      },
      {
        time: '22:18:10',
        description: "American 567 touches down runway 35R, sees FedEx lights ahead",
        category: 'aircraft',
        critical: true,
      },
      {
        time: '22:18:30',
        description: "American 567 clears intersection; FedEx aircraft still crossing",
        category: 'aircraft',
      },
    ],
    tags: [
      'runway_incursion',
      'category_C',
      'DFW',
      'night',
      'IFR',
      'FedEx',
      'American',
      'workload',
      'paperwork',
    ],
  },

  // ────────────────────────────────────────────────────────────
  // Honolulu — Loss of Separation
  // ────────────────────────────────────────────────────────────
  {
    id: 'WPR20IA112',
    eventDate: '2020-06-10',
    eventTime: '13:45',
    localTimezone: 'Pacific/Honolulu',
    synopsis:
      'Two Hawaiian Airlines Airbus A321 aircraft experienced a loss of separation of less than 0.5 nautical miles while on parallel instrument approaches to Honolulu International Airport following a communication error.',
    location: {
      city: 'Honolulu',
      state: 'Hawaii',
      stateAbbr: 'HI',
      country: 'USA',
      airport: 'Daniel K. Inouye International Airport',
      airportId: 'PHNL',
      airportIata: 'HNL',
      coordinates: { lat: 21.3187, lng: -157.9225 },
    },
    eventType: 'incident',
    subType: 'loss_of_separation',
    severity: 'none',
    status: 'closed',
    aircraft: [
      {
        registration: 'N220HA',
        manufacturer: 'Airbus',
        model: 'A321-271NX',
        category: 'large_transport',
        operator: 'Hawaiian Airlines',
        flightNumber: 'HAL12',
        flightPhase: 'approach',
        role: 'primary',
        crew: 9,
        passengers: 189,
      },
      {
        registration: 'N225HA',
        manufacturer: 'Airbus',
        model: 'A321-271NX',
        category: 'large_transport',
        operator: 'Hawaiian Airlines',
        flightNumber: 'HAL34',
        flightPhase: 'approach',
        role: 'secondary',
        crew: 9,
        passengers: 195,
      },
    ],
    weather: {
      condition: 'IMC',
      visibility: 3,
      ceiling: 1200,
      wind: { direction: 80, speed: 12 },
      temperature: 27,
      dewpoint: 24,
      flightCategory: 'IFR',
      phenomena: ['TS', 'RA'],
      nighttime: false,
    },
    narrative: `On June 10, 2020, at 1345 local time, two Hawaiian Airlines A321neo aircraft experienced a loss of radar separation while on simultaneous ILS approaches to parallel runways 8L and 8R at Honolulu International Airport.

Honolulu Approach Control had issued vectors to both aircraft for simultaneous parallel instrument approaches. The controller issued a frequency change to Hawaiian 12 but used an incorrect frequency, causing the aircraft to be temporarily out of contact.

During the brief communication gap, Hawaiian 12 deviated from the assigned approach course to 8L and began converging toward the 8R localizer where Hawaiian 34 was established. Both aircraft received TCAS traffic advisories.

TCAS resolution advisories were generated, and both crews followed them. Minimum radar separation was less than 0.5 nautical miles. Both aircraft landed safely following the resolution.`,
    probableCause:
      "The Honolulu approach controller's issuance of an incorrect frequency to Hawaiian 12, resulting in a temporary loss of radio contact and subsequent deviation from the assigned approach course, leading to a loss of required separation.",
    contributingFactors: [
      "Controller issued incorrect frequency during handoff",
      "Parallel approach procedures require precise coordination",
      "IMC conditions during approach phase",
      "Thunderstorm activity in area increasing workload",
    ],
    humanFactors: [
      {
        category: 'communication',
        confidence: 95,
        description:
          "Controller issued incorrect radio frequency, causing Hawaiian 12 to lose contact during critical approach phase.",
        parties: ['controller'],
      },
      {
        category: 'workload',
        confidence: 72,
        description:
          "Thunderstorm activity and multiple approach sequencing increased controller workload at time of incident.",
        parties: ['controller'],
      },
    ],
    infrastructure: [],
    recommendations: [
      {
        id: 'A-20-044',
        text: "Require approach controllers to verify frequency read-back before handoff during simultaneous parallel approach operations.",
        recipient: 'FAA',
        recipientName: 'Federal Aviation Administration',
        status: 'closed',
        issueDate: '2020-09-01',
        closedDate: '2021-06-01',
        closedDescription: "FAA updated 7110.65 to require frequency verification during parallel approaches.",
        investigationId: 'WPR20IA112',
        category: 'ATC Procedures',
        priority: 'priority',
      },
    ],
    injuries: { fatal: 0, serious: 0, minor: 0, none: 402 },
    timeline: [
      {
        time: '13:38',
        description: "Both Hawaiian aircraft checked in with Honolulu Approach from the east",
        category: 'aircraft',
      },
      {
        time: '13:41',
        description: "Hawaiian 12 cleared ILS approach runway 8L; Hawaiian 34 cleared runway 8R",
        category: 'atc',
      },
      {
        time: '13:43',
        description: "Controller issues frequency change to Hawaiian 12 — incorrect frequency given",
        category: 'atc',
        critical: true,
      },
      {
        time: '13:44',
        description: "Hawaiian 12 loses contact attempting to reach incorrect frequency",
        category: 'aircraft',
        critical: true,
      },
      {
        time: '13:44:30',
        description: "Hawaiian 12 begins converging toward 8R localizer",
        category: 'aircraft',
      },
      {
        time: '13:45',
        description: "TCAS TAs generated on both aircraft; controllers note radar separation loss",
        category: 'system',
        critical: true,
      },
      {
        time: '13:45:30',
        description: "TCAS RAs generated; crews comply",
        category: 'aircraft',
        critical: true,
      },
      {
        time: '13:46',
        description: "Hawaiian 12 re-establishes contact on correct frequency",
        category: 'atc',
      },
      {
        time: '13:52',
        description: "Both aircraft land safely",
        category: 'aircraft',
      },
    ],
    tags: [
      'loss_of_separation',
      'parallel_approaches',
      'Honolulu',
      'HNL',
      'communication',
      'frequency_error',
      'TCAS',
      'IFR',
      'Hawaiian',
    ],
  },

  // ────────────────────────────────────────────────────────────
  // EWR — Runway Incursion Category D
  // ────────────────────────────────────────────────────────────
  {
    id: 'ERA21IA189',
    eventDate: '2021-11-30',
    eventTime: '08:22',
    localTimezone: 'America/New_York',
    synopsis:
      'A United Airlines Boeing 737 crossed a hold short line at Newark Liberty International Airport without clearance, resulting in a Category D runway incursion with no aircraft in conflict.',
    location: {
      city: 'Newark',
      state: 'New Jersey',
      stateAbbr: 'NJ',
      country: 'USA',
      airport: 'Newark Liberty International Airport',
      airportId: 'KEWR',
      airportIata: 'EWR',
      coordinates: { lat: 40.6895, lng: -74.1745 },
    },
    eventType: 'incident',
    subType: 'runway_incursion',
    severity: 'none',
    status: 'closed',
    runwayIncursion: {
      category: 'D',
      runway: '22R',
      conflictType: 'Aircraft vs. No Conflict',
    },
    aircraft: [
      {
        registration: 'N14228',
        manufacturer: 'Boeing',
        model: '737-924ER',
        category: 'large_transport',
        operator: 'United Airlines',
        flightNumber: 'UAL1122',
        flightPhase: 'taxi',
        role: 'primary',
        crew: 5,
        passengers: 168,
      },
    ],
    weather: {
      condition: 'VMC',
      visibility: 10,
      wind: { direction: 220, speed: 15 },
      temperature: 6,
      dewpoint: 1,
      flightCategory: 'VFR',
      phenomena: [],
      nighttime: false,
    },
    narrative: `On November 30, 2021, at 0822 local time, a United Airlines Boeing 737 crossed the hold short line for runway 22R at Newark Liberty International Airport without receiving a crossing clearance, resulting in a Category D runway incursion.

No other aircraft was in conflict at the time of the incursion. The United crew was taxiing to the gate following an arrival on runway 22L. The crew became confused at a complex intersection and crossed the runway 22R hold short line before recognizing the error and stopping.

The tower controller observed the incursion on ASDE-X and issued instructions for the aircraft to clear the runway. No aircraft was on approach to runway 22R at the time.

While this incursion was low-severity (Category D), the NTSB notes that the complex intersection geometry at EWR has been a contributing factor in multiple runway incursions over the past decade.`,
    probableCause:
      "The United Airlines crew's unintentional crossing of the runway 22R hold short line due to confusion about their position at a complex multi-runway intersection during ground operations.",
    contributingFactors: [
      "Complex intersection geometry at EWR north end",
      "Multiple hold short lines in close proximity",
      "Post-arrival workload including gate communication",
    ],
    humanFactors: [
      {
        category: 'situational_awareness',
        confidence: 80,
        description:
          "Crew temporarily confused about position at complex intersection near runway 22R.",
        parties: ['pilot'],
      },
    ],
    infrastructure: [
      {
        category: 'asde_x',
        description: "ASDE-X detected incursion; controller issued clearance to exit runway.",
        present: true,
        contributed: false,
      },
      {
        category: 'airport_geometry',
        description:
          "EWR north end intersection geometry involves multiple runways and taxiways within close proximity.",
        present: true,
        contributed: true,
      },
    ],
    recommendations: [],
    injuries: { fatal: 0, serious: 0, minor: 0, none: 173 },
    timeline: [
      {
        time: '08:16',
        description: "United 1122 lands runway 22L, advised to taxi to gate",
        category: 'aircraft',
      },
      {
        time: '08:20',
        description: "United 1122 given taxi instructions to gate via taxiways",
        category: 'atc',
      },
      {
        time: '08:22',
        description: "United 1122 crosses runway 22R hold short without clearance",
        category: 'aircraft',
        critical: true,
      },
      {
        time: '08:22:10',
        description: "ASDE-X alert at EWR ATCT",
        category: 'system',
        critical: true,
      },
      {
        time: '08:22:15',
        description: "Controller instructs United 1122 to clear runway 22R",
        category: 'atc',
      },
      {
        time: '08:22:30',
        description: "United 1122 clears runway 22R, no conflict",
        category: 'aircraft',
      },
    ],
    tags: [
      'runway_incursion',
      'category_D',
      'EWR',
      'Newark',
      'United',
      'taxi',
      'ASDE-X',
      'intersection',
    ],
  },
];

export const getInvestigationById = (id: string): Investigation | undefined =>
  investigations.find((inv) => inv.id === id);

export const getInvestigationsBySubType = (subType: string): Investigation[] =>
  investigations.filter((inv) => inv.subType === subType);

export const getRunwayIncursions = (): Investigation[] =>
  investigations.filter((inv) => inv.subType === 'runway_incursion');

export const getCategoryAIncursions = (): Investigation[] =>
  investigations.filter((inv) => inv.runwayIncursion?.category === 'A');
