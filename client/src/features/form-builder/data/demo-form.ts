import type { FormSchema } from '../../../types/form'

export const demoForm: FormSchema = {
  id: 'merchant-onboarding-demo',
  title: 'Merchant Onboarding Form',
  description:
    'Collect core business, owner, and operations details through a guided onboarding flow.',
  steps: [
    {
      id: 'business-details',
      title: 'Business Details',
      description: 'Basic information about the merchant and business identity.',
      fields: [
        {
          id: 'business-name',
          type: 'text',
          name: 'businessName',
          label: 'Business name',
          placeholder: 'Enter the registered business name',
          required: true,
        },
        {
          id: 'business-type',
          type: 'select',
          name: 'businessType',
          label: 'Business type',
          required: true,
          options: [
            { id: 'sole', label: 'Sole Proprietorship', value: 'sole' },
            { id: 'llp', label: 'LLP', value: 'llp' },
            { id: 'private', label: 'Private Limited', value: 'privateLimited' },
          ],
        },
        {
          id: 'gst-number',
          type: 'text',
          name: 'gstNumber',
          label: 'GST number',
          placeholder: '22AAAAA0000A1Z5',
          showIf: {
            field: 'businessType',
            operator: 'equals',
            value: 'privateLimited',
          },
        },
      ],
    },
    {
      id: 'operations',
      title: 'Operations',
      description: 'Understand the merchant setup and needs.',
      fields: [
        {
          id: 'support-email',
          type: 'text',
          name: 'supportEmail',
          label: 'Support email',
          placeholder: 'support@company.com',
          required: true,
        },
        {
          id: 'sales-channels',
          type: 'checkbox',
          name: 'salesChannels',
          label: 'Sales channels',
          options: [
            { id: 'store', label: 'Physical Store', value: 'store' },
            { id: 'website', label: 'Website', value: 'website' },
            { id: 'marketplace', label: 'Marketplace', value: 'marketplace' },
          ],
        },
        {
          id: 'launch-date',
          type: 'date',
          name: 'launchDate',
          label: 'Expected launch date',
        },
      ],
    },
  ],
}
