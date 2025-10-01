import CompanyService from './CompanyService'
import { getApiBase } from './EnvironmentService'

const getCompanyBrandingLogoUrl = async (): Promise<string> => {
  const url = `${getApiBase()}/api/administration/branding/assets/logo?companyId=${CompanyService.getCompanyDetails().companyId}`

  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed to fetch logo')
    const blob = await response.blob()
    return URL.createObjectURL(blob)
  } catch (error) {
    console.error('Error fetching company branding logo:', error)
    throw error
  }
}

const BrandingAssetService = {
  getCompanyBrandingLogoUrl,
}

export default BrandingAssetService
