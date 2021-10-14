import { Region } from './region';

export class Resource {
	resourceId?: number;
	resourceName?: string;
	resourceType?: string;
	resourceRegions?: Region [];
	region?: Region [];
}
