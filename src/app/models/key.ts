export class Keys{

    /**
     * Server url key
     */
    server_url: string = "https://crawler.providerpassport.info";
    // server_url: string = "http://localhost:8081";

    // server_url: string = "http://ec2-107-22-50-170.compute-1.amazonaws.com:8081";
    // server_url: string = "http://credily-webcrawler-v2-us-region-382879096.us-east-1.elb.amazonaws.com";
    // server_url: string = "https://crawleradmin.providerpassport.io";


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