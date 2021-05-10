import { Circle } from 'better-react-spinkit';

import { Center } from './styles';

export default function Loading() {
  return (
    <Center style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
        <div>
          <img
            src='https://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png'
            height={200}
            style={{ marginBottom: 10 }}
          />

          <Circle color="#3CBC28" size={60} />
        </div>
    </Center>
  )
}