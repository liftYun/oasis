package org.muhan.oasis.reservation.dto.in;

import lombok.Data;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.StaticStruct;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.abi.datatypes.generated.Uint64;
import org.web3j.abi.datatypes.generated.Uint8;

import java.math.BigInteger;

@Data
public class Booking extends StaticStruct {
    public String guest;
    public String host;
    public BigInteger amount, fee, checkIn, checkOut, status;
    public PolicySnap policy;

    public Booking(Address guest, Address host, Uint256 amount, Uint256 fee,
                   Uint64 checkIn, Uint64 checkOut, Uint8 status, PolicySnap policy) {
        super(guest, host, amount, fee, checkIn, checkOut, status, policy);
        this.guest = guest.getValue();
        this.host = host.getValue();
        this.amount = amount.getValue();
        this.fee = fee.getValue();
        this.checkIn = checkIn.getValue();
        this.checkOut = checkOut.getValue();
        this.status = status.getValue();
        this.policy = policy;
    }
}
