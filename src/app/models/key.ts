export class Keys{

    /**
     * Server url key
     */
    // server_url: string = "http://credily-webcrawler-v2-us-region-382879096.us-east-1.elb.amazonaws.com:8081";
    server_url: string = "http://3.89.117.232:8081"
    // server_url: string = "http://localhost:8081"; 

    api_version_one = "/api/v1";
    login = '/auth/login'
    lookup_config_controller = '/license-lookup-configuration'
    lookup_taxonomy = '/license-lookup-configuration/taxonomy'
    lookup_crawler_attribute = '/license-lookup-configuration/attribute'
    crewler_controller = '/web-crawler'
    provider_crawler_controller = '/provider-crawler'
    queue = '/aws';
    
    
}