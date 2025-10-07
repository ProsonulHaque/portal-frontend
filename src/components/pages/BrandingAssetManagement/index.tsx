import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  InputLabel,
  Divider,
} from '@mui/material'
import { PageHeader } from '@catena-x/portal-shared-components'
import { SelectList } from '../CompanyData/SelectList'
import { Dropzone, type DropzoneFile } from 'components/shared/basic/Dropzone'
import {
  type DropAreaProps,
  DropArea,
} from '@catena-x/portal-shared-components'
import BrandingAssetService from 'services/BrandingAssetsService'
import CompanyService from 'services/CompanyService'
import './style.scss'
import { type Company } from 'types/CompanyDataTypes'
import {
  type BrandingLogoData,
  type BrandingData,
} from 'types/BrandingAssetManagementTypes'

export default function BrandingAssetManagement() {
  const { t } = useTranslation()
  const userCompany: Company = {
    companyId: CompanyService.getCompanyDetails().companyId,
    companyName: CompanyService.getCompanyDetails().name,
  }
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(
    userCompany
  )
  const [companies, setCompanies] = useState<Company[]>([])
  const [brandingData, setBrandingData] = useState<BrandingData>({
    logoUrl: '',
    footerText: '',
  })
  const [logoFile, setLogoFile] = useState<DropzoneFile | null>(null)
  const [isSavingLogo, setIsSavingLogo] = useState(false)
  const [selectedLogo, setSelectedLogo] = useState(false)
  const [isUpdatingLogo, setIsUpdatingLogo] = useState(false)
  const [isUpdatingFooter, setIsUpdatingFooter] = useState(false)

  useEffect(() => {
    CompanyService.getCompanyDdl()
      .then((companies) => {
        setCompanies(companies)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  // Load branding data when company is selected
  useEffect(() => {
    if (selectedCompany) {
      loadBrandingData()
    }
  }, [selectedCompany])

  const loadBrandingData = async () => {
    if (!selectedCompany) return

    const [logoUrl, footerText] = await Promise.all([
      BrandingAssetService.getCompanyBrandingLogoUrl().catch((error) => {
        console.error(error)
        return ''
      }),
      BrandingAssetService.getCompanyBrandingFooterText().catch((error) => {
        console.error(error)
        return ''
      }),
    ])

    setBrandingData({
      logoUrl,
      footerText,
    })
  }

  const handleCompanyChange = (company: Company) => {
    setSelectedCompany(company)
  }

  const handleLogoUpload = (files: DropzoneFile[]) => {
    if (files.length > 0) {
      setLogoFile(files[0])
      setSelectedLogo(true)

      // Create preview URL
      const previewUrl = URL.createObjectURL(files[0])
      setBrandingData((prev) => ({ ...prev, logoUrl: previewUrl }))
    }
  }

  const handleLogoSave = async () => {
    if (!selectedCompany || !logoFile) return

    try {
      setIsSavingLogo(true)

      const logoData: BrandingLogoData = {
        CompanyId: selectedCompany.companyId,
        CompanyLogoFile: logoFile,
      }
      await BrandingAssetService.saveCompanyBrandingLogo(logoData)

      setSelectedLogo(false)
      setLogoFile(null)
      alert('Logo saved successfully')
    } catch (error) {
      console.error(error)
      alert('Error saving logo!')
    } finally {
      setIsSavingLogo(false)
    }
  }

  const handleLogoRemove = () => {
    if (!selectedCompany) return

    BrandingAssetService.deleteCompanyBrandingLogo(selectedCompany.companyId)
      .then(() => {
        setLogoFile(null)
        setBrandingData((prev) => ({ ...prev, logoUrl: '' }))
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const handleFooterTextChange = (value: string) => {
    setBrandingData((prev) => ({ ...prev, footerText: value }))
  }

  const handleLogoUpdate = async () => {
    if (!selectedCompany || !logoFile) return

    try {
      setIsUpdatingLogo(true)
      await BrandingAssetService.updateCompanyBrandingLogo(logoFile)
      setLogoFile(null)
      alert('Logo updated successfully!')
    } catch (error) {
      console.error(error)
      alert('Error updating logo')
    } finally {
      setIsUpdatingLogo(false)
    }
  }

  const handleUpdateFooter = async () => {
    if (!selectedCompany) return

    try {
      setIsUpdatingFooter(true)
      await BrandingAssetService.updateCompanyBrandingFooter(
        brandingData.footerText
      )

      alert('Footer updated successfully!')
    } catch (error) {
      console.error('Error updating footer:', error)
      alert('Error updating footer')
    } finally {
      setIsUpdatingFooter(false)
    }
  }

  const renderDropArea = (props: DropAreaProps) => {
    return (
      <DropArea
        {...props}
        size="normal"
        translations={{
          title: t('content.brandingAssetManagement.logo.uploadHint'),
          subTitle: t('content.brandingAssetManagement.logo.supportedFormats'),
          errorTitle: t('content.brandingAssetManagement.logo.fileSizeError'),
        }}
      />
    )
  }

  return (
    <div className="branding-asset-management">
      <PageHeader
        title={t('content.brandingAssetManagement.headerTitle')}
        topPage={false}
        headerHeight={200}
      />

      <div className="main-container">
        <div className="container">
          {/* Company Selection */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {t('content.brandingAssetManagement.companySelection.title')}
              </Typography>
              <SelectList
                items={companies}
                label={t(
                  'content.brandingAssetManagement.companySelection.label'
                )}
                placeholder={t(
                  'content.brandingAssetManagement.companySelection.placeholder'
                )}
                keyTitle="companyName"
                onChangeItem={handleCompanyChange}
                defaultValue={selectedCompany}
              />
            </CardContent>
          </Card>

          <Grid container spacing={3}>
            {/* Company Branding Logo Card */}
            <Grid item xs={12} md={6}>
              <Card className="branding-card">
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {t('content.brandingAssetManagement.logo.title')}
                  </Typography>

                  {/* Current Logo Display */}
                  {brandingData.logoUrl && (
                    <Box sx={{ mb: 2, textAlign: 'center' }}>
                      <img
                        src={brandingData.logoUrl}
                        alt="Current logo"
                        style={{
                          maxWidth: '200px',
                          maxHeight: '100px',
                          objectFit: 'contain',
                        }}
                      />
                      <Box
                        sx={{
                          mt: 1,
                          display: 'flex',
                          justifyContent: 'center',
                          gap: 1,
                        }}
                      >
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={handleLogoRemove}
                        >
                          {t('content.brandingAssetManagement.logo.remove')}
                        </Button>
                      </Box>
                    </Box>
                  )}

                  <Divider sx={{ my: 2 }} />

                  {/* File Upload */}
                  <Box>
                    <InputLabel sx={{ mb: 1 }}>
                      {t('content.brandingAssetManagement.logo.uploadLabel')}
                    </InputLabel>
                    <Dropzone
                      files={logoFile ? [logoFile] : undefined}
                      onChange={handleLogoUpload}
                      acceptFormat={{
                        'image/jpeg': ['.jpg', '.jpeg'],
                        'image/png': ['.png'],
                        'image/svg+xml': ['.svg'],
                      }}
                      maxFileSize={1 * 1024 * 1024} // 1MB
                      maxFilesToUpload={1}
                      enableDeleteOverlay={false}
                      DropArea={renderDropArea}
                      errorText={t(
                        'content.brandingAssetManagement.logo.fileSizeError'
                      )}
                    />
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{ mt: 1, display: 'block' }}
                    >
                      {t('content.brandingAssetManagement.logo.fileSizeHint')}
                    </Typography>

                    {/* Save Logo Button */}
                    {(!brandingData.logoUrl || selectedLogo) && (
                      <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Button
                          variant="contained"
                          onClick={handleLogoSave}
                          disabled={isSavingLogo || !logoFile}
                          size="small"
                        >
                          {isSavingLogo
                            ? t('content.brandingAssetManagement.logo.saving')
                            : t('content.brandingAssetManagement.logo.save')}
                        </Button>
                      </Box>
                    )}

                    {/* Update Logo Button */}
                    {brandingData.logoUrl && !selectedLogo && (
                      <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Button
                          variant="contained"
                          onClick={handleLogoUpdate}
                          disabled={isUpdatingLogo || !logoFile}
                          size="small"
                        >
                          {isUpdatingLogo
                            ? t('content.brandingAssetManagement.logo.updating')
                            : t('content.brandingAssetManagement.logo.update')}
                        </Button>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Company Branding Footer Card */}
            <Grid item xs={12} md={6}>
              <Card className="branding-card">
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {t('content.brandingAssetManagement.footer.title')}
                  </Typography>

                  <Box>
                    <InputLabel sx={{ mb: 1 }}>
                      {t('content.brandingAssetManagement.footer.label')}
                    </InputLabel>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      variant="outlined"
                      value={brandingData.footerText}
                      onChange={(e) => {
                        handleFooterTextChange(e.target.value)
                      }}
                      placeholder={t(
                        'content.brandingAssetManagement.footer.placeholder'
                      )}
                      helperText={t(
                        'content.brandingAssetManagement.footer.helperText'
                      )}
                    />

                    {/* Update Footer Button */}
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <Button
                        variant="contained"
                        onClick={handleUpdateFooter}
                        disabled={
                          isUpdatingFooter || !brandingData.footerText.trim()
                        }
                        size="small"
                      >
                        {isUpdatingFooter
                          ? t('content.brandingAssetManagement.footer.updating')
                          : t('content.brandingAssetManagement.footer.update')}
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  )
}
