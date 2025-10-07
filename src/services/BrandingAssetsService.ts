import { type DropzoneFile } from 'components/shared/basic/Dropzone'
import CompanyService from './CompanyService'
import { getApiBase } from './EnvironmentService'
import UserService from './UserService'
import { type BrandingFooterData } from 'types/BrandingAssetManagementTypes'

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

const updateCompanyBrandingLogo = async (logo: DropzoneFile) => {
  const url = `${getApiBase()}/api/administration/branding/assets/logo/company/${CompanyService.getCompanyDetails().companyId}`
  const formData = new FormData()
  formData.append('CompanyLogoFile', logo)
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      authorization: `Bearer ${UserService.getToken()}`,
    },
    body: formData,
  })
  if (!response.ok) throw new Error('Failed to update logo')
}

const updateCompanyBrandingFooter = async (footer: string) => {
  const url = `${getApiBase()}/api/administration/branding/assets/footer/company/${CompanyService.getCompanyDetails().companyId}`
  const footerData: BrandingFooterData = {
    Footer: footer,
  }
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      authorization: `Bearer ${UserService.getToken()}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(footerData),
  })
  if (!response.ok) throw new Error('Failed to update footer')
}

const deleteCompanyBrandingLogo = async (companyId: string) => {
  const url = `${getApiBase()}/api/administration/branding/assets/logo/company/${companyId}`
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${UserService.getToken()}`,
    },
  })

  if (!response.ok) throw new Error('Failed to delete logo')
}

const BrandingAssetService = {
  getCompanyBrandingLogoUrl,
  getCompanyBrandingFooterText,
  updateCompanyBrandingLogo,
  updateCompanyBrandingFooter,
  deleteCompanyBrandingLogo,
}

export default BrandingAssetService
