package org.muhan.oasis.reservation.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.muhan.oasis.common.base.BaseResponse;
import org.muhan.oasis.common.base.BaseResponseStatus;
import org.muhan.oasis.common.exception.BaseException;
import org.muhan.oasis.reservation.dto.in.RegistReservationRequestDto;
import org.muhan.oasis.reservation.entity.ReservationEntity;
import org.muhan.oasis.reservation.repository.ReservationRepository;
import org.muhan.oasis.user.entity.UserEntity;
import org.muhan.oasis.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import static org.muhan.oasis.common.base.BaseResponseStatus.NO_EXIST_USER;

@Service
@Log4j2
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {
    private final UserRepository userRepository;
    private final ReservationRepository reservationRepository;

    @Override
    public String registReserVation(Long userId, RegistReservationRequestDto dto) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.NO_EXIST_USER));

        ReservationEntity reservationEntity = RegistReservationRequestDto.to(user, dto);

        String result = reservationRepository.save(reservationEntity).getReservationId();

        if(result.isEmpty())

        return result;
    }
}
