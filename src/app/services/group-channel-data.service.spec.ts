import { TestBed } from '@angular/core/testing';

import { GroupChannelDataService } from './group-channel-data.service';

describe('GroupChannelDataService', () => {
  let service: GroupChannelDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupChannelDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
