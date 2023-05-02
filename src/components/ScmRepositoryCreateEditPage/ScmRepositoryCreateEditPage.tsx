import {
  ActionGroup,
  Button,
  Flex,
  FlexItem,
  FlexProps,
  Form,
  FormGroup,
  FormHelperText,
  Switch,
  TextInput,
} from '@patternfly/react-core';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { SCMRepository } from 'pnc-api-types-ts';

import { IFields, useForm } from 'hooks/useForm';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ServiceContainerCreatingUpdating } from 'components/ServiceContainers/ServiceContainerCreatingUpdating';

import * as scmRepositoryApi from 'services/scmRepositoryApi';

import { validateScmUrl } from 'utils/formValidationHelpers';
import { createSafePatch, transformFormToValues } from 'utils/patchHelper';
import { generatePageTitle } from 'utils/titleHelper';

interface IScmRepositoryCreateEditPageProps {
  isEditPage?: boolean;
}

const formConfig = {
  // internalUrl
  //           externalUrl
  //           preBuildSyncEnabled
  name: {
    isRequired: true,
  },
  description: {},
  internalUrl: {
    validators: [{ validator: validateScmUrl, errorMessage: 'Invalid URL format.' }],
  },
  externalUrl: {
    validators: [{ validator: validateScmUrl, errorMessage: 'Invalid URL format.' }],
  },
};

export const ScmRepositoryCreateEditPage = ({ isEditPage = false }: IScmRepositoryCreateEditPageProps) => {
  const flexDirection: FlexProps['direction'] = { default: 'column' };

  const [id, setId] = useState<string>('');
  const navigate = useNavigate();
  const urlPathParams = useParams();

  // create page
  const serviceContainerCreatePage = useServiceContainer(scmRepositoryApi.createScmRepository, {
    initLoadingState: false,
  });

  // edit page - get method
  const serviceContainerEditPageGet = useServiceContainer(scmRepositoryApi.getScmRepository);
  const serviceContainerEditPageGetRunner = serviceContainerEditPageGet.run;

  // edit page - patch method
  const serviceContainerEditPagePatch = useServiceContainer(scmRepositoryApi.patchScmRepository, {
    initLoadingState: false,
  });

  useTitle(
    generatePageTitle({
      pageType: isEditPage ? 'Edit' : 'Create',
      serviceContainer: serviceContainerEditPageGet,
      firstLevelEntity: 'SCM Repository',
    })
  );

  const submitCreate = (data: IFields) => {
    console.error('submitCreate');
    return serviceContainerCreatePage
      .run({
        serviceData: {
          data: {
            name: data.name.value,
            description: data.description.value,
            scmRepositoryUrl: data.scmRepositoryUrl.value,
            issueTrackerUrl: data.issueTrackerUrl.value,
            engineeringTeam: data.engineeringTeam.value,
            technicalLeader: data.technicalLeader.value,
          },
        },
      })
      .then((response: any) => {
        const scmRepositoryId = response?.data?.id;
        if (!scmRepositoryId) {
          throw new Error(`Invalid scmRepositoryId coming from Orch POST response: ${scmRepositoryId}`);
        }
        navigate(`/scm-repositories/${scmRepositoryId}`);
      })
      .catch((e: any) => {
        throw new Error('Failed to create SCM Repository.');
      });
  };

  const submitUpdate = (data: IFields) => {
    const patchData = createSafePatch(serviceContainerEditPageGet.data, transformFormToValues(data));

    serviceContainerEditPagePatch
      .run({ serviceData: { id, patchData } })
      .then(() => {
        navigate(`/scm-repositories/${id}`);
      })
      .catch(() => {
        throw new Error('Failed to edit SCM Repository.');
      });
  };

  const { fields, onChange, reinitialize, onSubmit, isSubmitDisabled } = useForm(
    formConfig,
    isEditPage ? submitUpdate : submitCreate
  );

  useEffect(() => {
    console.log(`useEffect`);
    if (isEditPage) {
      if (urlPathParams.scmRepositoryId) {
        serviceContainerEditPageGetRunner({ serviceData: { id: urlPathParams.scmRepositoryId } }).then((response: any) => {
          const scmRepository: SCMRepository = response.data;

          setId(scmRepository.id);
          reinitialize({
            internalUrl: scmRepository.internalUrl,
            externalUrl: scmRepository.externalUrl,
            preBuildSyncEnabled: JSON.stringify(scmRepository.preBuildSyncEnabled),
          });
        });
      } else {
        throw new Error(`Invalid scmRepositoryId: ${urlPathParams.scmRepositoryId}`);
      }
    }
  }, [isEditPage, urlPathParams.scmRepositoryId, serviceContainerEditPageGetRunner, reinitialize]);

  const formComponent = fields.scmRepositoryUrl && (
    <ContentBox padding>
      <div className="w-70">
        <Form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          {!isEditPage && (
            <FormGroup
              isRequired
              label="SCM Repository URL"
              fieldId="scmRepositoryUrl"
              helperText={
                <FormHelperText isHidden={fields.scmRepositoryUrl.state !== 'error'} isError>
                  {fields.scmRepositoryUrl.errorMessages?.join(' ')}
                </FormHelperText>
              }
            >
              <TextInput
                isRequired
                validated={fields.scmRepositoryUrl.state}
                type="text"
                id="scmRepositoryUrl"
                name="scmRepositoryUrl"
                value={fields.scmRepositoryUrl.value}
                autoComplete="off"
                onChange={(scmRepositoryUrl) => {
                  onChange('scmRepositoryUrl', scmRepositoryUrl);
                }}
              />
            </FormGroup>
          )}
          {isEditPage && (
            <>
              <FormGroup
                isRequired
                label="Internal SCM URL"
                fieldId="internalUrl"
                helperText={
                  <FormHelperText isHidden={fields.internalUrl.state !== 'error'} isError>
                    {fields.internalUrl.errorMessages?.join(' ')}
                  </FormHelperText>
                }
              >
                <TextInput
                  isRequired
                  validated={fields.internalUrl.state}
                  type="text"
                  id="internalUrl"
                  name="internalUrl"
                  value={fields.internalUrl.value}
                  autoComplete="off"
                  onChange={(internalUrl) => {
                    onChange('internalUrl', internalUrl);
                  }}
                />
              </FormGroup>
              <FormGroup label="External SCM URL" fieldId="externalUrl">
                <TextInput
                  isRequired
                  validated={fields.externalUrl.state}
                  type="text"
                  id="externalUrl"
                  name="externalUrl"
                  value={fields.externalUrl.value}
                  autoComplete="off"
                  onChange={(externalUrl) => {
                    onChange('externalUrl', externalUrl);
                  }}
                />
              </FormGroup>
            </>
          )}
          <FormGroup
            label="Pre-build Sync"
            fieldId="preBuildSyncEnabled"
            helperText={
              <FormHelperText isHidden={fields.preBuildSyncEnabled.state !== 'error'} isError>
                {fields.preBuildSyncEnabled.errorMessages?.join(' ')}
              </FormHelperText>
            }
          >
            <Switch
              id="preBuildSyncEnabled"
              name="preBuildSyncEnabled"
              isChecked={fields.preBuildSyncEnabled.value?.toLowerCase() === 'true'}
              onChange={(preBuildSyncEnabled) => {
                onChange('preBuildSyncEnabled', preBuildSyncEnabled);
              }}
            />
          </FormGroup>
          <ActionGroup>
            <Button
              variant="primary"
              isDisabled={isSubmitDisabled}
              onClick={() => {
                onSubmit();
              }}
            >
              {isEditPage ? 'Update' : 'Create'} SCM Repository
            </Button>
          </ActionGroup>
        </Form>
      </div>
    </ContentBox>
  );

  return (
    <PageLayout
      title={isEditPage ? 'Update SCM Repository' : 'Create SCM Repository'}
      description={
        isEditPage ? (
          <>You can update current SCM Repository attributes below.</>
        ) : (
          <>You can create a SCM Repository with either a Internal URL(from Gerrit) or External URL(from any other SCM system).</>
        )
      }
    >
      <Flex direction={flexDirection}>
        <FlexItem>
          {isEditPage ? (
            <ServiceContainerCreatingUpdating
              {...serviceContainerEditPagePatch}
              serviceContainerLoading={serviceContainerEditPageGet}
              title="SCM Repository"
            >
              {formComponent}
            </ServiceContainerCreatingUpdating>
          ) : (
            <ServiceContainerCreatingUpdating {...serviceContainerCreatePage}>{formComponent}</ServiceContainerCreatingUpdating>
          )}
        </FlexItem>
      </Flex>
    </PageLayout>
  );
};
