import { type DropzoneFile } from 'components/shared/basic/Dropzone'

export interface BrandingData {
  logoUrl?: string
  footerText: string
}

export interface BrandingFooterData {
  Footer: string
}

export interface BrandingLogoData {
  CompanyId: string
  CompanyLogoFile: DropzoneFile
}
