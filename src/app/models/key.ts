export class Keys{

    /**
     * Server url key
     */
    server_url: string = "http://localhost:8081"; 
    // server_url: string = "http://ec2-43-204-22-113.ap-south-1.compute.amazonaws.com:8081"; 

    api_version_one = "/api/v1";
    login = '/auth/login'
    lookup_config_controller = '/license-lookup-configuration'
    lookup_taxonomy = '/license-lookup-configuration/taxonomy'
    lookup_crawler_attribute = '/license-lookup-configuration/attribute'
    crewler_controller = '/web-crawler'
    provider_crawler_controller = '/provider-crawler'
    
    
}