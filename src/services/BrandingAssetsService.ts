import CompanyService from './CompanyService'
import { getApiBase } from './EnvironmentService'

const getCompanyBrandingLogoUrl = async (): Promise<string> => {
  const url = `${getApiBase()}/api/administration/branding/assets/logo?companyId=${CompanyService.getCompanyDetails().companyId}`
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch logo')
  const blob = await response.blob()
  return URL.createObjectURL(blob)
}

const getCompanyBrandingFooterText = async (): Promise<string> => {
  const url = `${getApiBase()}/api/administration/branding/assets/footer?companyId=${CompanyService.getCompanyDetails().companyId}`
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch footer')
  const data = await response.json()
  return data.companyBrandingFooter
}

const BrandingAssetService = {
  getCompanyBrandingLogoUrl,
  getCompanyBrandingFooterText,
}

export default BrandingAssetService
