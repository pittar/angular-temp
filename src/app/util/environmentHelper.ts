import { environment } from '../../environments/environment';

/*
 * This is meant to encapsulate the backend API, it's a start right now, but could evolve 
 */ 

export function buildLinkagesURL(): string { 
    return 'http://' + environment.backendHostname + ':' + environment.backendPort + '/linkages/';
}

// http://localhost:8080/programs/
// http://spring-boot-hw3-niruban.52.233.57.239.nip.io/programs
export function buildProgramsURL(): string {
    return 'http://' + environment.backendHostname + ':' + environment.backendPort + '/programs/';
}

export function buildProgramsURLPortAware(): string {
    var programsURL = 'http://' + environment.backendHostname;
    if (environment.backendPort != '')
      programsURL = programsURL + ':' + environment.backendPort + '/programs/';
    return programsURL;
  }


// "http://localhost:8080/linkage-types/"
export function buildLinkageTypesURL(): string {
    return 'http://' + environment.backendHostname + ':' + environment.backendPort + '/linkage-types/';
}

// "http://localhost:8080/key-types/"
export function buildKeyTypesURL(): string {
    return 'http://' + environment.backendHostname + ':' + environment.backendPort + '/key-types/';
}

// "http://localhost:8080/linkages/search/
export function buildLinkagesSearchURL(): string {
    return 'http://' + environment.backendHostname + ':' + environment.backendPort + '/linkages/search/'; 
}

// http://localhost:8080/linkages/searchMeta/
export function buildLinkagesMetaDataSearchURL(): string {
    return 'http://' + environment.backendHostname + ':' + environment.backendPort + '/linkages/searchMeta/';  
}

