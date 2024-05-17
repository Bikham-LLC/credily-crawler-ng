export class Keys{

    /**
     * Server url key
     */
    server_url: string = "https://crawler.providerpassport.info";
    // server_url: string = "http://localhost:8081";


    api_version_one = "/api/v1";
    login = '/auth/login'
    lookup_config_controller = '/license-lookup-configuration'
    lookup_taxonomy = '/license-lookup-configuration/taxonomy'
    lookup_crawler_attribute = '/license-lookup-configuration/attribute'
    crewler_controller = '/web-crawler'
    provider_crawler_controller = '/provider-crawler'
    queue = '/queue';
    report = '/report'
    dashboard = '/dashboard'
    
    
}