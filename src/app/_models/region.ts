export class Region {
	regionName?: string;
	status?: string;
	preferred?: boolean;
	latencyUrl?: string;
	bandwidthUrl?: string;
	latencyMedian?: number;
	bandwidthAverage?: number;
	latencyClass?: string;
	bandwidthClass?: string;
	loadingLatency?: boolean;
	loadingBandwidth?: boolean;
}
