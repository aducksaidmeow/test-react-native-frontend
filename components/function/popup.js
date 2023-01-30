import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Modal } from "react-native";
import { StyleSheet } from "react-native";

export default function Popup({ popup, setPopup, message, setMessage }) {
  return (
    <>
    {/*<Modal visible={popup} transparent animationType="none" onRequestClose={() => setPopup(false)}>*/}
      <TouchableOpacity style={styles.outerContainer} activeOpacity={1} onPressOut={() => setPopup(0)}>
        <TouchableWithoutFeedback>
          <>
            {popup === -1 && 
              <View style={styles.innerContainerFailed}>
                <Text style={{
                  fontFamily: 'Philosopher-Bold',
                  fontSize: 30,
                }}>Lỗi</Text>
                <Text style={{
                  fontFamily: 'Philosopher-Regular',
                  fontSize: 20,
                }}>{message}</Text>
              </View>
            }
            {popup === 1 && 
              <View style={styles.innerContainerSuccess}>
                <Text style={{
                  fontFamily: 'Philosopher-Bold',
                  fontSize: 30,
                }}>Thành công</Text>
              </View>
            }
          </>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    {/*</Modal>*/}
    </>
  );   
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: '#F94A29'
  }, 
  innerContainerFailed: {
    //height: '30%',
    //aspectRatio: '1:1',
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#F55050',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  innerContainerSuccess: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#03C988',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  }
})