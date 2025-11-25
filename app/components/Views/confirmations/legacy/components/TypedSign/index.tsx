import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  ViewStyle,
  TextStyle,
  LayoutChangeEvent,
} from 'react-native';
import { fontStyles } from '../../../../../../styles/common';
import SignatureRequest from '../SignatureRequest';
import ExpandedMessage from '../SignatureRequest/ExpandedMessage';
import Device from '../../../../../../util/device';
import { MetaMetricsEvents } from '../../../../../../core/Analytics';
import { MetricsEventBuilder } from '../../../../../../core/Analytics/MetricsEventBuilder';
import { KEYSTONE_TX_CANCELED } from '../../../../../../constants/error';
import { ThemeContext, mockTheme } from '../../../../../../util/theme';
import { escapeSpecialUnicode } from '../../../../../../util/string';
import { parseAndSanitizeSignTypedData } from '../../../../../../components/Views/confirmations/utils/signature';

import {
  addSignatureErrorListener,
  getAnalyticsParams,
  handleSignatureAction,
  removeSignatureErrorListener,
  shouldTruncateMessage,
  showWalletConnectNotification,
  typedSign,
} from '../../../../../../util/confirmation/signatureUtils';
import { isExternalHardwareAccount } from '../../../../../../util/address';
import createExternalSignModelNav from '../../../../../../util/hardwareWallet/signatureUtils';
import { SigningBottomSheetSelectorsIDs } from '../../../../../../../e2e/selectors/Browser/SigningBottomSheet.selectors';
import { withMetricsAwareness } from '../../../../../../components/hooks/useMetrics';
import { selectProviderTypeByChainId } from '../../../../../../selectors/networkController';
import { selectSignatureRequestById } from '../../../../../../selectors/signatureController';
import { RootState } from '../../../../../../reducers';
import { Theme } from '../../../../../../util/theme/models';
import { PageMeta } from '../SignatureRequest/types';
import { IUseMetricsHook } from '../../../../../hooks/useMetrics/useMetrics.types';
import { SecurityAlertResponse } from '../BlockaidBanner/BlockaidBanner.types';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

interface Styles {
  messageText: TextStyle;
  message: ViewStyle;
  truncatedMessageWrapper: ViewStyle;
  iosHeight: ViewStyle;
  androidHeight: ViewStyle;
  msgKey: TextStyle;
}

interface Colors {
  text: {
    default: string;
  };
}

interface TypedMessageV1Item {
  name: string;
  value: string;
}

interface TypedSignMessageParams {
  data: string | TypedMessageV1Item[];
  from: string;
  metamaskId: string;
  meta?: PageMeta;
  origin: string;
  version: 'V1' | 'V3' | 'V4';
}

interface TypedSignProps {
  navigation: NavigationProp<ParamListBase>;
  onReject: () => Promise<void>;
  onConfirm: () => Promise<void>;
  messageParams: TypedSignMessageParams;
  currentPageInformation: PageMeta;
  toggleExpandedMessage?: () => void;
  showExpandedMessage?: boolean;
  securityAlertResponse?: SecurityAlertResponse;
  metrics: IUseMetricsHook;
  networkType?: string;
}

interface TypedSignState {
  truncateMessage: boolean;
}

interface SignatureError {
  error: Error;
}

const createStyles = (colors: Colors): Styles =>
  StyleSheet.create({
    messageText: {
      color: colors.text.default,
      ...fontStyles.normal,
      fontFamily: Device.isIos() ? 'Courier' : 'Roboto',
    },
    message: {
      marginLeft: 10,
    },
    truncatedMessageWrapper: {
      marginBottom: 4,
      overflow: 'hidden',
    },
    iosHeight: {
      height: 70,
    },
    androidHeight: {
      height: 97,
    },
    msgKey: {
      ...fontStyles.bold,
    },
  });

/**
 * Component that supports eth_signTypedData and eth_signTypedData_v3
 */
class TypedSign extends PureComponent<TypedSignProps, TypedSignState> {
  declare context: Theme;

  state: TypedSignState = {
    truncateMessage: false,
  };

  componentDidMount = (): void => {
    const {
      messageParams: { metamaskId },
      messageParams,
      metrics,
    } = this.props;

    metrics.trackEvent(
      MetricsEventBuilder.createEventBuilder(
        MetaMetricsEvents.SIGNATURE_REQUESTED,
      )
        .addProperties(getAnalyticsParams(messageParams, 'typed_sign'))
        .build(),
    );
    addSignatureErrorListener(metamaskId, this.onSignatureError);
  };

  componentWillUnmount = (): void => {
    const {
      messageParams: { metamaskId },
    } = this.props;
    removeSignatureErrorListener(metamaskId, this.onSignatureError);
  };

  onSignatureError = ({ error }: SignatureError): void => {
    const { metrics } = this.props;
    if (error?.message.startsWith(KEYSTONE_TX_CANCELED)) {
      metrics.trackEvent(
        MetricsEventBuilder.createEventBuilder(
          MetaMetricsEvents.QR_HARDWARE_TRANSACTION_CANCELED,
        )
          .addProperties(getAnalyticsParams())
          .build(),
      );
    }
    showWalletConnectNotification(this.props.messageParams, false, true);
  };

  rejectSignature = async (): Promise<void> => {
    const { messageParams, onReject, securityAlertResponse } = this.props;
    await handleSignatureAction(
      onReject,
      messageParams,
      typedSign[messageParams.version],
      securityAlertResponse,
      false,
    );
  };

  confirmSignature = async (): Promise<void> => {
    const {
      messageParams,
      onConfirm,
      onReject,
      navigation,
      securityAlertResponse,
    } = this.props;
    if (!isExternalHardwareAccount(messageParams.from)) {
      await handleSignatureAction(
        onConfirm,
        messageParams,
        typedSign[messageParams.version],
        securityAlertResponse,
        true,
      );
    } else {
      navigation.navigate(
        ...(await createExternalSignModelNav(
          onReject,
          onConfirm,
          messageParams,
          typedSign[messageParams.version],
        )),
      );
    }
  };

  updateShouldTruncateMessage = (e: LayoutChangeEvent): void => {
    const truncateMessage = shouldTruncateMessage(e);
    this.setState({ truncateMessage });
  };

  getStyles = (): Styles => {
    const colors = this.context.colors || mockTheme.colors;
    return createStyles(colors as Colors);
  };

  renderTypedMessageV3 = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    obj: Record<string, any>,
  ): React.ReactNode[] => {
    const styles = this.getStyles();
    return Object.keys(obj).map((key) => (
      <View style={styles.message} key={key}>
        {obj[key] && typeof obj[key] === 'object' ? (
          <View>
            <Text style={[styles.messageText, styles.msgKey]}>
              {escapeSpecialUnicode(key)}:
            </Text>
            <View>
              {this.renderTypedMessageV3(obj[key] as Record<string, unknown>)}
            </View>
          </View>
        ) : (
          <Text style={styles.messageText}>
            <Text style={styles.msgKey}>{escapeSpecialUnicode(key)}:</Text>{' '}
            {escapeSpecialUnicode(`${obj[key]}`)}
          </Text>
        )}
      </View>
    ));
  };

  renderTypedMessage = (): React.ReactNode => {
    const { messageParams } = this.props;
    const styles = this.getStyles();

    if (messageParams.version === 'V1') {
      const data = messageParams.data as TypedMessageV1Item[];
      return (
        <View style={styles.message}>
          {data.map((obj, i) => (
            <View key={`${obj.name}_${i}`}>
              <Text style={[styles.messageText, styles.msgKey]}>
                {escapeSpecialUnicode(obj.name)}:
              </Text>
              <Text style={styles.messageText} key={obj.name}>
                {escapeSpecialUnicode(` ${obj.value}`)}
              </Text>
            </View>
          ))}
        </View>
      );
    }
    if (messageParams.version === 'V3' || messageParams.version === 'V4') {
      const result = parseAndSanitizeSignTypedData(
        messageParams.data as string,
      );
      if (result.sanitizedMessage) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return this.renderTypedMessageV3(result.sanitizedMessage as any);
      }
    }
    return null;
  };

  render(): React.ReactNode {
    const {
      messageParams,
      currentPageInformation,
      showExpandedMessage,
      toggleExpandedMessage,
      messageParams: { from },
      networkType,
    } = this.props;
    const { truncateMessage } = this.state;
    const messageWrapperStyles: ViewStyle[] = [];
    let domain: unknown;
    const styles = this.getStyles();

    if (messageParams.version === 'V3') {
      domain = JSON.parse(messageParams.data as string).domain;
    }

    if (truncateMessage) {
      messageWrapperStyles.push(styles.truncatedMessageWrapper);
      if (Device.isIos()) {
        messageWrapperStyles.push(styles.iosHeight);
      } else {
        messageWrapperStyles.push(styles.androidHeight);
      }
    }

    const rootView = showExpandedMessage ? (
      <ExpandedMessage
        currentPageInformation={currentPageInformation}
        renderMessage={this.renderTypedMessage}
        toggleExpandedMessage={toggleExpandedMessage}
      />
    ) : (
      <SignatureRequest
        navigation={this.props.navigation}
        onReject={this.rejectSignature}
        onConfirm={this.confirmSignature}
        toggleExpandedMessage={toggleExpandedMessage}
        domain={domain}
        currentPageInformation={currentPageInformation}
        truncateMessage={truncateMessage}
        type={typedSign[messageParams.version]}
        fromAddress={from}
        testID={SigningBottomSheetSelectorsIDs.TYPED_REQUEST}
        networkType={networkType}
      >
        <View
          style={messageWrapperStyles}
          onLayout={
            truncateMessage ? undefined : this.updateShouldTruncateMessage
          }
        >
          {this.renderTypedMessage()}
        </View>
      </SignatureRequest>
    );
    return rootView;
  }
}

TypedSign.contextType = ThemeContext;

interface OwnProps {
  messageParams: TypedSignMessageParams;
}

const mapStateToProps = (
  state: RootState,
  ownProps: OwnProps,
): { networkType: string | undefined; securityAlertResponse: unknown } => {
  const signatureRequest = selectSignatureRequestById(
    state,
    ownProps.messageParams.metamaskId,
  );

  return {
    networkType: signatureRequest?.chainId
      ? selectProviderTypeByChainId(state, signatureRequest.chainId)
      : undefined,
    securityAlertResponse: state.signatureRequest.securityAlertResponse,
  };
};

// Using type assertion for HOC compatibility - the HOC adds props that TypeScript
// cannot infer correctly
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default connect(mapStateToProps)(withMetricsAwareness(TypedSign as any));
