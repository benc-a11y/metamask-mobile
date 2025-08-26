import React, { useMemo, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Icon, {
  IconName,
  IconSize,
  IconColor,
} from '../../../../component-library/components/Icons/Icon';
import { useRatio } from '../utils';
import Text from '../../../Base/Text';
import BigNumber from 'bignumber.js';

interface TokenInfo {
  symbol: string;
  decimals: number;
}

interface RatioProps {
  sourceAmount: string;
  sourceToken: TokenInfo;
  destinationAmount: string;
  destinationToken: TokenInfo;
  boldSymbol?: boolean;
}

function Ratio({
  sourceAmount,
  sourceToken,
  destinationAmount,
  destinationToken,
  boldSymbol = false,
}: RatioProps) {
  /* Get the ratio between the assets given the selected quote*/
  const [ratioAsSource, setRatioAsSource] = useState<boolean>(true);

  const [numerator, denominator] = useMemo(() => {
    const source = { ...sourceToken, amount: sourceAmount };
    const destination = { ...destinationToken, amount: destinationAmount };

    return ratioAsSource ? [destination, source] : [source, destination];
  }, [
    destinationAmount,
    destinationToken,
    ratioAsSource,
    sourceAmount,
    sourceToken,
  ]);

  const ratio: BigNumber = useRatio(
    numerator?.amount,
    numerator?.decimals,
    denominator?.amount,
    denominator?.decimals,
  );

  const handleRatioSwitch = (): void =>
    setRatioAsSource((isSource) => !isSource);

  return (
    <TouchableOpacity onPress={handleRatioSwitch}>
      <Text primary={boldSymbol}>
        1{' '}
        <Text reset bold={boldSymbol}>
          {denominator?.symbol}
        </Text>{' '}
        = {ratio.toFormat(10)}{' '}
        <Text reset bold={boldSymbol}>
          {numerator?.symbol}
        </Text>{' '}
        <Icon
          name={IconName.Refresh}
          size={IconSize.Sm}
          color={IconColor.Primary}
        />
      </Text>
    </TouchableOpacity>
  );
}

export default Ratio;
