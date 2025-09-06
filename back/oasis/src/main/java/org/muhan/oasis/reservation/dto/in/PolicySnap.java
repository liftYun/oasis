package org.muhan.oasis.reservation.dto.in;

import lombok.Data;
import org.web3j.abi.datatypes.StaticStruct;
import org.web3j.abi.datatypes.generated.Uint16;
import org.web3j.abi.datatypes.generated.Uint32;

import java.math.BigInteger;

@Data
public class PolicySnap extends StaticStruct {
    public BigInteger before1, before2;
    public BigInteger amtPct1, amtPct2, amtPct3;
    public BigInteger feePct1, feePct2, feePct3;

    public PolicySnap(Uint32 before1, Uint32 before2,
                      Uint16 amtPct1, Uint16 amtPct2, Uint16 amtPct3,
                      Uint16 feePct1, Uint16 feePct2, Uint16 feePct3) {
        super(before1, before2, amtPct1, amtPct2, amtPct3, feePct1, feePct2, feePct3);
        this.before1 = before1.getValue();
        this.before2 = before2.getValue();
        this.amtPct1 = amtPct1.getValue();
        this.amtPct2 = amtPct2.getValue();
        this.amtPct3 = amtPct3.getValue();
        this.feePct1 = feePct1.getValue();
        this.feePct2 = feePct2.getValue();
        this.feePct3 = feePct3.getValue();
    }
}