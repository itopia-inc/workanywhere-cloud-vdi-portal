export class ActionResource {
	username?: string;
	resourceName?: string;
	resourceId?: number;
	resourceType?: string;
	region?: string;
  actionResource?: string;
  constructor(data?: any){
    this.username = data.username || '';
    this.resourceName = data.resourceName || '';
    this.resourceId = data.resourceId || 0;
    this.resourceType = data.resourceType || '';
    this.region = data.region || '';
    this.actionResource = data.actionResource || '';
  }
}
