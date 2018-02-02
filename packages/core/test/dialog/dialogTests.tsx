/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";
import { spy } from "sinon";

import * as Keys from "../../src/common/keys";
import { Classes, Dialog, Icon } from "../../src/index";

describe("<Dialog>", () => {
    it("renders its content correctly", () => {
        const dialog = mount(
            <Dialog isOpen={true} usePortal={false}>
                {createDialogContents()}
            </Dialog>,
        );
        [
            Classes.DIALOG,
            Classes.DIALOG_BODY,
            Classes.DIALOG_FOOTER,
            Classes.DIALOG_FOOTER_ACTIONS,
            Classes.DIALOG_HEADER,
            Classes.OVERLAY_BACKDROP,
        ].forEach(className => {
            assert.lengthOf(dialog.find(`.${className}`), 1, `missing ${className}`);
        });
    });

    it("attempts to close when .pt-overlay-backdrop element is moused down", () => {
        const onClose = spy();
        const dialog = mount(
            <Dialog isOpen={true} onClose={onClose} usePortal={false}>
                {createDialogContents()}
            </Dialog>,
        );
        dialog.find(`.${Classes.OVERLAY_BACKDROP}`).simulate("mousedown");
        assert.isTrue(onClose.calledOnce);
    });

    it("attempts to close when .pt-dialog-container element is moused down", () => {
        const onClose = spy();
        const dialog = mount(
            <Dialog isOpen={true} onClose={onClose} usePortal={false}>
                {createDialogContents()}
            </Dialog>,
        );
        dialog.find(`.${Classes.DIALOG_CONTAINER}`).simulate("mousedown");
        assert.isTrue(onClose.calledOnce);
    });

    it("doesn't close when canOutsideClickClose=false and .pt-overlay-backdrop element is moused down", () => {
        const onClose = spy();
        const dialog = mount(
            <Dialog canOutsideClickClose={false} isOpen={true} onClose={onClose} usePortal={false}>
                {createDialogContents()}
            </Dialog>,
        );
        dialog.find(`.${Classes.OVERLAY_BACKDROP}`).simulate("mousedown");
        assert.isTrue(onClose.notCalled);
    });

    it("doesn't close when canEscapeKeyClose=false and escape key is pressed", () => {
        const onClose = spy();
        const dialog = mount(
            <Dialog canEscapeKeyClose={false} isOpen={true} onClose={onClose} usePortal={false}>
                {createDialogContents()}
            </Dialog>,
        );
        dialog.simulate("keydown", { which: Keys.ESCAPE });
        assert.isTrue(onClose.notCalled);
    });

    describe("header", () => {
        it(`renders .${Classes.DIALOG_HEADER} if title prop is given`, () => {
            const dialog = mount(
                <Dialog isOpen={true} title="Hello!" usePortal={false}>
                    dialog body
                </Dialog>,
            );
            assert.match(dialog.find(`.${Classes.DIALOG_HEADER}`).text(), /^Hello!/);
        });

        it(`renders close button if isCloseButtonShown={true}`, () => {
            const dialog = mount(
                <Dialog isCloseButtonShown={true} isOpen={true} title="Hello!" usePortal={false}>
                    dialog body
                </Dialog>,
            );
            assert.lengthOf(dialog.find(`.${Classes.DIALOG_CLOSE_BUTTON}`), 1);

            dialog.setProps({ isCloseButtonShown: false });
            assert.lengthOf(dialog.find(`.${Classes.DIALOG_CLOSE_BUTTON}`), 0);
        });

        it("clicking close button triggers onClose", () => {
            const onClose = spy();
            const dialog = mount(
                <Dialog isCloseButtonShown={true} isOpen={true} onClose={onClose} title="Hello!" usePortal={false}>
                    dialog body
                </Dialog>,
            );
            dialog.find(`.${Classes.DIALOG_CLOSE_BUTTON}`).simulate("click");
            assert.isTrue(onClose.calledOnce, "onClose not called");
        });
    });

    it("only adds its className in one location", () => {
        const dialog = mount(<Dialog className="foo" isOpen={true} title="title" usePortal={false} />);
        assert.lengthOf(dialog.find(".foo").hostNodes(), 1);
    });

    // everything else about Dialog is tested by Overlay

    function createDialogContents(): JSX.Element[] {
        return [
            <div className={Classes.DIALOG_HEADER} key={0}>
                <Icon icon="inbox" iconSize={Icon.SIZE_LARGE} />
                <h4>Dialog header</h4>
            </div>,
            <div className={Classes.DIALOG_BODY} key={1}>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna alqua. Ut enim ad minimum veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.
                </p>
            </div>,
            <div className={Classes.DIALOG_FOOTER} key={2}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <button type="button" className="pt-button">
                        Secondary
                    </button>
                    <button className="pt-button pt-intent-primary" type="submit">
                        Primary
                    </button>
                </div>
            </div>,
        ];
    }
});
