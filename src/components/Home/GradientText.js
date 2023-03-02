import { Text } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

const GradientText = (props) => {
	return (
		<MaskedView maskElement={<Text {...props} />}>
			<LinearGradient
				colors={["#EB00FF", "#00A3FF"]}
				start={{ x: 0.2, y: 0 }}
				end={{ x: 1, y: 1 }}
			>
				<Text {...props} style={[props.style, { opacity: 0 }]} />
			</LinearGradient>
		</MaskedView>
	);
};
export default GradientText;