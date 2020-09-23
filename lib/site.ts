import { SiteMetaDataProps } from '../common/types';
import SiteConfig from '../site.config';

export function getSiteMetaData(): SiteMetaDataProps {
    return SiteConfig.siteMetadata;
}
