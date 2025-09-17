package org.muhan.oasis.key.vo.out;

import lombok.Builder;
import org.muhan.oasis.key.dto.out.KeyResponseDto;

import java.util.List;

@Builder
public class ListOfKeyResponseVO{
    public List<KeyResponseDto> listOfKeys;
}
