import { View, Text, TouchableOpacity } from 'react-native'
import styles from '../homeStyles'
import { Lucide } from "@react-native-vector-icons/lucide";
import {ErrorComponentProps} from '../../types/types'

const ErrorComponent = ({onRefreshData}: ErrorComponentProps) => {
    return (
        <View style={styles.textErrContainer}>
            <Lucide name="file-warning" color='white' size={64} />
            <View style={{ marginVertical: 30 }}>
                <Text style={[styles.textErr, { marginBottom: 10, fontSize: 36 }]}>¡Ha habido un error!</Text>
                <Text style={styles.textErr}>Intenta recargar la aplicación.</Text>
            </View>
            <TouchableOpacity 
                style={styles.reloadButton} 
                onPress={() => onRefreshData()}
            >
                <Text style={{ color: '#373737ff', fontWeight: 'bold' }}>Recargar</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ErrorComponent