import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, FlatList } from 'react-native';

const ESP32WebSocket = () => {
    const [device1Message, setDevice1Message] = useState<string | null>(null);
    const [device2Message, setDevice2Message] = useState<string | null>(null);
    const [device1Connected, setDevice1Connected] = useState<boolean>(false); // Track connection status for Device 1
    const [device2Connected, setDevice2Connected] = useState<boolean>(false); // Track connection status for Device 2

    const device1Socket = new WebSocket('ws://192.168.1.109:81'); // Replace with Device 1 IP
    const device2Socket = new WebSocket('ws://192.168.1.111:82'); // Replace with Device 2 IP

    useEffect(() => {
        // Device 1 WebSocket
        device1Socket.onopen = () => {
            console.log('Connected to Device 1 WebSocket');
            setDevice1Connected(true); // Set to true when connected
            device1Socket.send('Hello Device 1');
        };

        device1Socket.onmessage = (event) => {
            console.log('Message from Device 1:', event.data);
            setDevice1Message(event.data);
        };

        device1Socket.onerror = (error) => console.error('Device 1 WebSocket error:', error);
        device1Socket.onclose = () => {
            console.log('Device 1 WebSocket closed');
            setDevice1Connected(false); // Set to false when closed
        };

        // Device 2 WebSocket
        device2Socket.onopen = () => {
            console.log('Connected to Device 2 WebSocket');
            setDevice2Connected(true); // Set to true when connected
            device2Socket.send('Hello Device 2');
        };

        device2Socket.onmessage = (event) => {
            console.log('Message from Device 2:', event.data);
            setDevice2Message(event.data);
        };

        device2Socket.onerror = (error) => console.error('Device 2 WebSocket error:', error);
        device2Socket.onclose = () => {
            console.log('Device 2 WebSocket closed');
            setDevice2Connected(false); // Set to false when closed
        };

        return () => {
            device1Socket.close();
            device2Socket.close();
        };
    }, []);

    const renderItem = ({ item }: { item: string }) => (
        <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{item}</Text>
        </View>
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Device Connection</Text>
            <View style={styles.table}>
                <Text style={styles.tableHeader}>Device 1 Connection </Text>
                <FlatList
                    data={device1Message ? [device1Message] : []}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
            <View style={styles.table}>
                <Text style={styles.tableHeader}>Device 2 Connection</Text>
                <FlatList
                    data={device2Message ? [device2Message] : []}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    title={device1Connected ? "Device 1 connected" : "Device 1 not connected"}
                    color={device1Connected ? "#28a745" : "#dc3545"} // Green if connected, red if not
                    onPress={() => device1Connected && device1Socket.send('React Native: Ping Device 1')}
                    disabled={!device1Connected} // Disable button if not connected
                />
                <View style={styles.spacer} />
                <Button
                    title={device2Connected ? "Device 2 connected" : "Device 2 not connected"}
                    color={device2Connected ? "#28a745" : "#dc3545"} // Green if connected, red if not
                    onPress={() => device2Connected && device2Socket.send('React Native: Ping Device 2')}
                    disabled={!device2Connected} // Disable button if not connected
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#0a4f66',
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        marginBottom: 30,
        color: '#ddd',
        textAlign: 'center',
    },
    table: {
        marginVertical: 15,
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
    },
    tableHeader: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 10,
        color: '#ddd',
        textAlign: 'center',
    },
    tableRow: {
        borderBottomWidth: 1,
        borderColor: '#ddd',
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tableCell: {
        fontSize: 16,
        color: '#ddd',
        textAlign: 'center',
    },
    buttonContainer: {
        marginTop: 20,
        width: '100%',
        paddingHorizontal: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    spacer: {
        marginBottom: 10,
    },
});

export default ESP32WebSocket;
